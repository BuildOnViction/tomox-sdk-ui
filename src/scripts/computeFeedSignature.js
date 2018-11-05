var web3 = require('web3')
var fetch = require('node-fetch')
const { Wallet, providers, utils } = require('ethers')

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

function NewTopic(name, relatedContent) {
  relatedContent = utils.toUtf8Bytes(relatedContent)
  const contentLength = Math.min(relatedContent.length, topicLength)
  const topic = new Array(topicLength)
  for (let i = 0; i < contentLength; i++) {
    topic[i] = relatedContent[i]
  }

  const nameBytes = utils.toUtf8Bytes(name)
  const nameLength = Math.min(nameBytes.length, topicLength)

  safeXORBytes(topic, topic, nameBytes.slice(0, nameLength))
  return topic
}

function feedUpdateDigest(request /*request*/, data /*UInt8Array*/) {
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

  console.log('topicBytes: ' + utils.hexlify(topicBytes))

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

// request template, obtained calling http://localhost:8542/bzz-feed:/?user=<0xUSER>&topic=<0xTOPIC>&meta=1
let provider = new providers.JsonRpcProvider('http://localhost:8545', { chainId: 8888, name: undefined })
let signer = new Wallet('0x3411b45169aa5a8312e51357db68621031020dcf46011d7431db1bbb6d3922ce', provider)
const signingKey = new utils.SigningKey('3411b45169aa5a8312e51357db68621031020dcf46011d7431db1bbb6d3922ce')

const msg = {
  Coin: 'Tomo',
  ID: '2',
  Price: '100',
  Quantity: '10',
  Side: 'ask',
  Timestamp: 1538650124,
  TradeID: '1',
  Type: 'limit'
}
const topicName = 'Tomo'
const topic = NewTopic('Token', topicName)
const request = {
  feed: {
    topic: web3.utils.bytesToHex(topic),
    user: '0x28074f8d0fd78629cd59290cac185611a8d60109'
  },
  protocolVersion: 0
}

fetch(`http://localhost:8080/orders/${request.feed.user}/${topicName}/encode`, {
  method: 'POST',
  header: {
    Accept: 'application/json',
    'Content-Type': 'application/octet-stream'
  },
  body: JSON.stringify(msg)
})
  .then(res => res.buffer())
  .then(async data => {
    const bzzURL = `http://localhost:8542/bzz-feed:/?user=${request.feed.user}&topic=${request.feed.topic}`
    const meta = await fetch(`${bzzURL}&meta=1`).then(res => res.json())

    request.epoch = meta.epoch

    // test the digest with signer from client and compare the digest from server
    const digest = feedUpdateDigest(request, data)
    console.log('data: ' + utils.hexlify(data))
    console.log('digest:' + digest)
    console.log('userAddress: ' + request.feed.user)
    // we need to calculate the right signature then update

    const signature = await signer.signMessage(digest)

    const signatureObj = signingKey.signDigest(digest)
    const signature1 = `${signatureObj.r}${signatureObj.s.substr(2)}${signatureObj.v.toString(16)}`

    console.log('signature:' + signature, signature1)

    fetch(`${bzzURL}&level=${request.epoch.level}&time=${request.epoch.time}&signature=${signature}`, {
      method: 'POST',
      header: {
        Accept: 'application/octet-stream',
        'Content-Type': 'application/octet-stream'
      },
      body: data
    })
      .then(ret => ret.text())
      .then(text => console.log(text))
      .catch(r => console.log(r))
  })
