const fetch = require('node-fetch')
const { Wallet, providers, utils } = require('ethers')
const {
  // newTopic,
  feedUpdateDigest,
  getSwarmSig,
} = require('../utils/swarmFeed')
const { encodeBytes } = require('../utils/rlp')

// request template, obtained calling http://localhost:8542/bzz-feed:/?user=<0xUSER>&topic=<0xTOPIC>&meta=1
const provider = new providers.JsonRpcProvider('http://localhost:8545', {
  chainId: 8888,
  name: undefined,
})

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
  const bzzURL = `http://localhost:8542/bzz-feed:/?user=${
    request.feed.user
  }&topic=${request.feed.topic}`
  console.log(bzzURL)
  const meta = await fetch(`${bzzURL}&meta=1`)
    .then(res => res.json())
    .catch(err => console.log('err', err))
  const signature = await testSignature(meta.epoch, data)
  fetch(
    `${bzzURL}&level=${request.epoch.level}&time=${
      request.epoch.time
    }&signature=${signature}`,
    {
      method: 'POST',
      header: {
        'Content-Type': 'application/octet-stream',
      },

      body: data,
    }
  )
    .then(res => console.log('status', res.status))
    .catch(r => console.log(r))
}

function updateSwarm(request, msgs) {
  const data = encodeBytes(msgs)
  console.log('data: [' + data.join(' ') + ']')
  testUpdate(data)
}

function padTopic(topic) {
  const bytesTopic = utils.padZeros(topic, 32)
  return utils.hexlify(bytesTopic)
}

const msgs = [
  {
    id: '0x5b8ba1e94971a5143fe0908e',
    amount: utils.bigNumberify('10000000000000000000'),
    baseToken: '0x4bcb5bf25befb3e1250f0cee1b1892230f84a3f3',
    filledAmount: utils.bigNumberify('1000000000000000000'),
    timestamp: 1542000614,
    exchangeAddress: '0xd68c26b99a40227c4abe51020edfd9bba438b297',
    makeFee: utils.bigNumberify('10'),
    nonce: utils.bigNumberify('9581389967892164'),
    pairName: 'AE/WETH',
    pricepoint: utils.bigNumberify('10000000'),
    quoteToken: '0xd645c13c35141d61f273edc0f546bef48a48001d',
    side: 'BUY',
    status: 'OPEN',
    takeFee: utils.bigNumberify('0'),
    userAddress: '0x28074f8D0fd78629cd59290cac185611a8d60109',
    hash: '0x9391daa047348fef78da66f1f327f8de58700907d51385d810e54d9bac85edf8',
    signature:
      '0x6e01147b0f25f533d7e86e82bfac9ace6c169cb46b6bad5112cefc8bcfd4bd0667ad7ed6cec728888d59bf46768b4b99f4941b3e7d150cac126b64ac4565de721c',
  },
]
const topic = padTopic('0x620C38566BAD7a895cce707F42DCd5eaC1f94861')

// let msgs = {
//   chain: 'ethereum',
//   addressIndex: 10,
//   address: '0x787DFf5a56CF30d676e45d8DE4518c03C335386E',
//   associatedAddress: '0x59B8515E7fF389df6926Cd52a086B0f1f46C630A',
//   tomochainPublicKey: '0x28074f8D0fD78629CD59290Cac185611a8d60109',
//   createdAt: 1542000614
// };

// const topic = padTopic(utils.toUtf8Bytes('ethereum'));

const keyPair = {
  '0x28074f8d0fd78629cd59290cac185611a8d60109':
    '0x3411b45169aa5a8312e51357db68621031020dcf46011d7431db1bbb6d3922ce',
  '0x59B8515E7fF389df6926Cd52a086B0f1f46C630A':
    '0x17c6c258e1590e9ccd06feddfd3855d19490cec93be96ad6d52d16bdf9cc22c9',
}
const userAddress = Object.keys(keyPair)[0]
const request = {
  feed: {
    topic,
    user: userAddress,
  },
  protocolVersion: 0,
}

const signer = new Wallet(keyPair[userAddress], provider)

updateSwarm(request, msgs)
