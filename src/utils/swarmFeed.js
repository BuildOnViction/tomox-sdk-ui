const { utils } = require('ethers')

const topicLength = 32
const userLength = 20
const timeLength = 7
const levelLength = 1
const headerLength = 8
const updateMinLength =
  topicLength + userLength + timeLength + levelLength + headerLength

function safeXORBytes(dst, a, b) {
  const n = Math.min(a.length, b.length)

  for (let i = 0; i < n; i++) {
    dst[i] = a[i] ^ b[i]
  }
  return n
}

module.exports.padTopic = function(topic) {
  const bytesTopic = utils.padZeros(topic, 32)
  return utils.hexlify(bytesTopic)
}

module.exports.getSwarmSig = function(signature) {
  const sig =
    typeof signature === 'string' ? signature : utils.joinSignature(signature)
  // fix recovery
  return (
    sig.substr(0, sig.length - 2) +
    '0' +
    (parseInt(sig.substr(-2), 16) - 27).toString()
  )
}

module.exports.newTopic = function(name, relatedContentStr) {
  const relatedContent = relatedContentStr.startsWith('0x')
    ? utils.arrayify(relatedContentStr)
    : utils.toUtf8Bytes(relatedContentStr)
  const contentLength = Math.min(relatedContent.length, topicLength)
  // using array buffer is safe and fast
  const buf = new ArrayBuffer(topicLength)
  const view = new DataView(buf)
  for (let i = 0; i < contentLength; i++) {
    view.setUint8(i, relatedContent[i])
  }
  const topic = new Uint8Array(buf)

  const nameBytes = utils.toUtf8Bytes(name)
  const nameLength = Math.min(nameBytes.length, topicLength)

  safeXORBytes(view, topic, nameBytes.slice(0, nameLength))
  return utils.hexlify(topic)
}

module.exports.feedUpdateDigest = function(request, data) {
  let topicBytes = undefined
  let userBytes = undefined
  let protocolVersion = 0

  protocolVersion = request.protocolVersion

  try {
    topicBytes = utils.arrayify(request.feed.topic)
  } catch (err) {
    console.error('topicBytes: ' + err)
    return undefined
  }

  try {
    userBytes = utils.arrayify(request.feed.user)
  } catch (err) {
    console.error('topicBytes: ' + err)
    return undefined
  }

  const buf = new ArrayBuffer(updateMinLength + data.length)
  const view = new DataView(buf)
  let cursor = 0

  view.setUint8(cursor, protocolVersion) // first byte is protocol version.
  cursor += headerLength // leave the next 7 bytes (padding) set to zero

  topicBytes.forEach(function(v) {
    view.setUint8(cursor, v)
    cursor++
  })

  userBytes.forEach(function(v) {
    view.setUint8(cursor, v)
    cursor++
  })

  // time is little-endian
  view.setUint32(cursor, request.epoch.time, true)
  cursor += 7

  view.setUint8(cursor, request.epoch.level)
  cursor++

  data.forEach(function(v) {
    view.setUint8(cursor, v)
    cursor++
  })

  return utils.keccak256(utils.hexlify(new Uint8Array(buf)))
}
