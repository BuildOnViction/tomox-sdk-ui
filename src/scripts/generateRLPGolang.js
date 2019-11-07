const { utils } = require('ethers')

const msg = {
  id: '0x5b8ba1e94971a5143fe0908e',
  amount: utils.bigNumberify('10000000000000000000'),
  baseToken: '0x4bcb5bf25befb3e1250f0cee1b1892230f84a3f3',
  filledAmount: utils.bigNumberify('1000000000000000000'),
  timestamp: 1542000614,
  exchangeAddress: '0xd68c26b99a40227c4abe51020edfd9bba438b297',
  makeFee: utils.bigNumberify('0'),
  nonce: utils.bigNumberify('9581389967892164'),
  pairName: 'AE/WETH',
  pricepoint: utils.bigNumberify('10000000'),
  quoteToken: '0xd645c13c35141d61f273edc0f546bef48a48001d',
  side: 'BUY',
  status: 'OPEN',
  takeFee: utils.bigNumberify('0'),
  hash: '0x9391daa047348fef78da66f1f327f8de58700907d51385d810e54d9bac85edf8',
  signature:
    '0x6e01147b0f25f533d7e86e82bfac9ace6c169cb46b6bad5112cefc8bcfd4bd0667ad7ed6cec728888d59bf46768b4b99f4941b3e7d150cac126b64ac4565de721c',
  userAddress: '0x28074f8d0fd78629cd59290cac185611a8d60109',
}

// let msg = {
//   chain: 'ethereum',
//   addressIndex: 10,
//   address: '0x28074f8d0fd78629cd59290cac185611a8d60109',
//   associatedAddress: '0x59B8515E7fF389df6926Cd52a086B0f1f46C630A',
//   tomochainPublicKey: '0x28074f8D0fD78629CD59290Cac185611a8d60109',
//   createdAt: 1542000614
// };

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
  const cammelCase =
    field === 'id' ? 'ID' : field[0].toUpperCase() + field.substr(1)
  const type = getType(msg[field])
  ret += `\t${cammelCase.padEnd(10)}\t${type.padStart(
    10
  )}\t\`json:"${field}"\`\n`
})

ret += '}'

console.log(ret)
