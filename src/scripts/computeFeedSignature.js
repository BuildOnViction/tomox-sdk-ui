var web3 = require('web3')
var fetch = require('node-fetch')
const { Wallet, providers, utils } = require('ethers')
const rlpEncodeBytes = require('./rlpEncodeBytes')

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

function feedUpdateData(request /*request*/, data /*UInt8Array*/) {
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

  return utils.hexlify(new Uint8Array(buf))
}

function feedUpdateDigest(request /*request*/, data /*UInt8Array*/) {
  return utils.keccak256(feedUpdateData(request, data))
}

// request template, obtained calling http://localhost:8542/bzz-feed:/?user=<0xUSER>&topic=<0xTOPIC>&meta=1
let provider = new providers.JsonRpcProvider('http://localhost:8545', { chainId: 8888, name: undefined })
let signer = new Wallet('0x3411b45169aa5a8312e51357db68621031020dcf46011d7431db1bbb6d3922ce', provider)

const topicName = 'Tomo'
const topic = NewTopic('Token', topicName)
const request = {
  feed: {
    topic: web3.utils.bytesToHex(topic),
    user: '0x28074f8d0fd78629cd59290cac185611a8d60109'
  },
  protocolVersion: 0
}

function getSwarmSig(sig) {
  return sig.substr(0, sig.length - 2) + '0' + (parseInt(sig.substr(-2), 16) - 27).toString()
}

async function testSignature(epoch, data) {
  request.epoch = epoch
  console.log('data: ' + utils.hexlify(data))
  const digest = feedUpdateDigest(request, data)
  // console.log('digest:' + digest);
  // const feedData = feedUpdateData(request, data);
  // const signature = await signer.signMessage(feedData);

  let signature = utils.joinSignature(signer.signingKey.signDigest(digest))
  signature = getSwarmSig(signature)
  // const signatureObj = signer.signingKey.signDigest(digest);
  // const signature1 = `${signatureObj.r}${signatureObj.s.substr(2)}0${signatureObj.recoveryParam}`;
  console.log('Data signature: ' + signature)
  // console.log(
  //   'C signature: 0x6b9b09d4bfb8b7e56377731f5e85660528906ad3425c10c88cdbbe24cbfab51e2fcd7948111f6f8a41bfe01baae278ba37f61c9eb98a17a48bd2fdc781bec9f001'
  // );

  return signature
}

async function testUpdate(data) {
  if (!data) return
  // to upload to server, we need to convert it into Buffer if it is array
  const bzzURL = `http://localhost:8542/bzz-feed:/?user=${request.feed.user}&topic=${request.feed.topic}`
  const meta = await fetch(`${bzzURL}&meta=1`).then(res => res.json())
  const signature = await testSignature(meta.epoch, data)
  fetch(`${bzzURL}&level=${request.epoch.level}&time=${request.epoch.time}&signature=${signature}`, {
    method: 'POST',
    header: {
      'Content-Type': 'application/octet-stream'
    },

    body: data
  })
    .then(ret => ret.text())
    .then(text => console.log(text))
    .catch(r => console.log(r))
}

// let data = web3.utils.hexToBytes('0xdedd845bb5f00c856c696d69748361736b8231308331303084546f6d6f3231');
// testSignature(
//   {
//     time: 1538650124,
//     level: 25,
//   },
//   data
// );

function updateSwarm(request, msgs) {
  const data = rlpEncodeBytes(msgs)
  console.log('data: [' + data.join(' ') + ']')
  testUpdate(data)
}

let msgs = [
  {
    id: '0x5b8ba1e94971a5143fe0908e',
    amount: utils.bigNumberify('10000000000000000000'),
    baseToken: '0x4bcb5bf25befb3e1250f0cee1b1892230f84a3f3',
    buyAmount: utils.bigNumberify('10000000000000000000'),
    buyToken: '0x4bcb5bf25befb3e1250f0cee1b1892230f84a3f3',
    timestamp: 1542000614,
    exchangeAddress: '0xd68c26b99a40227c4abe51020edfd9bba438b297',
    expires: utils.bigNumberify('10000000000000'),
    filledAmount: utils.bigNumberify('0'),
    makeFee: utils.bigNumberify('0'),
    nonce: utils.bigNumberify('9581389967892164'),
    pairName: 'AE/WETH',
    pricepoint: utils.bigNumberify('10000000'),
    quoteToken: '0xd645c13c35141d61f273edc0f546bef48a48001d',
    sellAmount: utils.bigNumberify('100000000000000000000'),
    sellToken: '0xd645c13c35141d61f273edc0f546bef48a48001d',
    side: 'BUY',
    status: 'OPEN',
    takeFee: utils.bigNumberify('0'),
    hash: '0xd0fbab67df5408e8e09ac22833d6d56c6736df4ce5514bb0529f3fadee219053',
    signature:
      '0xf7581e4b94c68c5f761c07145104d701aaa08580fb247efb2b212f8dfc73af4c56567688e52ac6e368f1828b467fff1d3a39249998220f39fd3f7aed4dd397671b',
    userAddress: '0x28074f8d0fd78629cd59290cac185611a8d60109'
  }
]

updateSwarm(request, msgs)
