let web3

// Check if Metamask extension is installed, it will inject a web3 instance into page (version 0.20.3)
// In that case, use injected version instead
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  web3 = window.web3
} else {
  web3 = require('web3')
}

const { utils } = require('ethers')

var topicLength = 32
var userLength = 20
var timeLength = 7
var levelLength = 1
var headerLength = 8
var updateMinLength = topicLength + userLength + timeLength + levelLength + headerLength

function safeXORBytes(dst, a, b) {
  const n = Math.min(a.length, b.length)

  for (let i = 0; i < n; i++) {
    dst[i] = a[i] ^ b[i]
  }
  return n
}

module.exports.getSwarmSig = function(signature) {
  const sig = typeof signature === 'string' ? signature : utils.joinSignature(signature)
  // fix recovery
  return sig.substr(0, sig.length - 2) + '0' + (parseInt(sig.substr(-2), 16) - 27).toString()
}

module.exports.newTopic = function(name, relatedContent) {
  relatedContent = utils.toUtf8Bytes(relatedContent)
  const contentLength = Math.min(relatedContent.length, topicLength)
  const topic = new Array(topicLength)
  for (let i = 0; i < contentLength; i++) {
    topic[i] = relatedContent[i]
  }

  const nameBytes = utils.toUtf8Bytes(name)
  const nameLength = Math.min(nameBytes.length, topicLength)

  safeXORBytes(topic, topic, nameBytes.slice(0, nameLength))
  return web3.utils.bytesToHex(topic)
}

module.exports.feedUpdateDigest = function(request, data) {
  var topicBytes = undefined
  var userBytes = undefined
  var protocolVersion = 0

  protocolVersion = request.protocolVersion

  try {
    topicBytes = web3.utils.hexToBytes(request.feed.topic)
  } catch (err) {
    console.error('topicBytes: ' + err)
    return undefined
  }

  try {
    userBytes = web3.utils.hexToBytes(request.feed.user)
  } catch (err) {
    console.error('topicBytes: ' + err)
    return undefined
  }

  var buf = new ArrayBuffer(updateMinLength + data.length)
  var view = new DataView(buf)
  var cursor = 0

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
