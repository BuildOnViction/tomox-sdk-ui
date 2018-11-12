const { utils } = require('ethers')

let msg = {
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

const getType = val => {
  if (typeof val === 'string') {
    if (val.startsWith('0x')) {
      return '[]byte'
    }
    return 'string'
  }
  if (typeof val === 'boolean') return 'bool'
  if (typeof val === 'number') return 'uint64'
  if (utils.BigNumber.isBigNumber(val)) {
    return '*big.Int'
  }
  return 'interface{}'
}

const fields = Object.keys(msg).sort()

let ret = 'type OrderFeed struct {\n'

fields.forEach(field => {
  const cammelCase = field === 'id' ? 'ID' : field[0].toUpperCase() + field.substr(1)
  const type = getType(msg[field])
  ret += `\t${cammelCase.padEnd(10)}\t${type.padStart(10)}\t\`json:"${field}"\`\n`
})

ret += '}'

console.log(ret)
