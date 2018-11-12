var web3 = require('web3')
var fetch = require('node-fetch')
const { Wallet, providers, utils } = require('ethers')
const { newTopic, feedUpdateDigest, getSwarmSig } = require('../utils/swarmFeed')
const { encodeBytes } = require('../utils/rlp')

// request template, obtained calling http://localhost:8542/bzz-feed:/?user=<0xUSER>&topic=<0xTOPIC>&meta=1
let provider = new providers.JsonRpcProvider('http://localhost:8545', { chainId: 8888, name: undefined })
let signer = new Wallet('0x3411b45169aa5a8312e51357db68621031020dcf46011d7431db1bbb6d3922ce', provider)

const topicName = 'Tomo'
const topic = newTopic('Token', topicName)
const request = {
  feed: {
    topic,
    user: '0x28074f8d0fd78629cd59290cac185611a8d60109'
  },
  protocolVersion: 0
}

async function testSignature(epoch, data) {
  request.epoch = epoch
  console.log('data: ' + utils.hexlify(data))
  const digest = feedUpdateDigest(request, data)
  console.log('digest:' + digest)

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
  const meta = await fetch(`${bzzURL}&meta=1`)
    .then(res => res.json())
    .catch(err => console.log('err', err))
  const signature = await testSignature(meta.epoch, data)
  fetch(`${bzzURL}&level=${request.epoch.level}&time=${request.epoch.time}&signature=${signature}`, {
    method: 'POST',
    header: {
      'Content-Type': 'application/octet-stream'
    },

    body: data
  })
    .then(res => console.log('status', res.status))
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
  const data = encodeBytes(msgs)
  console.log('data: [' + data.join(' ') + ']')
  testUpdate(data)
}

let msgs = [
  {
    id: '0x5b8ba1e94971a5143fe0908e',
    amount: utils.bigNumberify('10000000000000000000'),
    baseToken: '0x4bcb5bf25befb3e1250f0cee1b1892230f84a3f3',
    buyAmount: utils.bigNumberify('15000000000000000000'),
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
