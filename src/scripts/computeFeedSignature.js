var web3 = require('web3')
var fetch = require('node-fetch')
const utils = require('ethers').utils

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

function getBytes(str) {
  var bytes = []
  for (var i = 0; i < str.length; i++) {
    var char = str.charCodeAt(i)
    bytes.push(char & 0xff)
  }
  return bytes
}

function NewTopic(name, relatedContent) {
  relatedContent = getBytes(relatedContent)
  const contentLength = Math.min(relatedContent.length, topicLength)
  const topic = new Array(topicLength)
  for (let i = 0; i < contentLength; i++) {
    topic[i] = relatedContent[i]
  }

  const nameBytes = getBytes(name)
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

  console.log('topicBytes: ' + web3.utils.bytesToHex(topicBytes))

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
  console.log(web3.utils.bytesToHex(new Uint8Array(buf)))

  return web3.utils.sha3(web3.utils.bytesToHex(new Uint8Array(buf)))
}

// GetDigest creates the feed update digest used in signatures
// the serialized payload is cached in .binaryData
// func (r *Request) GetDigest() (result common.Hash, err error) {
// 	hasher := hashPool.Get().(hash.Hash)
// 	defer hashPool.Put(hasher)
// 	hasher.Reset()
// 	dataLength := r.Update.binaryLength()
// 	if r.binaryData == nil {
// 		r.binaryData = make([]byte, dataLength+signatureLength)
// 		if err := r.Update.binaryPut(r.binaryData[:dataLength]); err != nil {
// 			return result, err
// 		}
// 	}
// 	hasher.Write(r.binaryData[:dataLength]) //everything except the signature.

// 	return common.BytesToHash(hasher.Sum(nil)), nil
// }

// data payload
let data //= new Uint8Array([5, 154, 15, 165, 62]);

// request template, obtained calling http://localhost:8500/bzz-feed:/?user=<0xUSER>&topic=<0xTOPIC>&meta=1
const topic = NewTopic('Token', 'Tomo')
const request = {
  feed: {
    topic: web3.utils.bytesToHex(topic),
    user: '0x28074f8D0fD78629CD59290Cac185611a8d60109'
  },
  epoch: { time: 1538650124, level: 25 },
  protocolVersion: 0
}

fetch(`http://localhost:8542/bzz-feed:/?topic=${request.feed.topic}&user=${request.feed.user}`)
  .then(res => res.buffer())
  .then(encoded => {
    data = encoded
    // test the digest with signer from client and compare the digest from server
    const digest = feedUpdateDigest(request, data)
    console.log('digest:' + digest)
  })
