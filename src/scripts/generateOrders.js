import fs from 'fs'
import { rand, randInt } from '../utils/helpers'
import tokenPairs from '../jsons/tokenPairs.json'
import { utils } from 'ethers'

const orderHistory = []
const { pairs } = tokenPairs
const minTimeStamp = 1500000000000
const maxTimeStamp = 1520000000000
const minAmount = 0.1
const maxAmount = 10000
const minPrice = 100
const maxPrice = 100000

const randomOrderSide = () => (randInt(0, 1) === 1 ? 'BUY' : 'SELL')
const randomOrderType = () => ['MARKET', 'LIMIT'][randInt(0, 1)]
const randomOrderStatus = () => ['EXECUTED', 'CANCELED', 'PARTIALLY_FILLED'][randInt(0, 2)]
const randomPair = () => pairs[randInt(0, 5)]
const randomFee = () => rand(10000, 100000)
const randomAmount = () => rand(minAmount, maxAmount)
const randomRatio = () => rand(0, 1)
const randomTimestamp = () => randInt(minTimeStamp, maxTimeStamp)
const randomPrice = () => rand(minPrice, maxPrice)
const randomHash = () => utils.sha256(utils.randomBytes(100))
const randomAddress = () => randomHash().slice(0, 42)

for (let i = 0; i < 200; i++) {
  const order = {
    userAddress: randomAddress(),
    buyTokenAddress: randomAddress(),
    sellTokenAddress: randomAddress(),
    hash: randomHash(),
    type: randomOrderType(),
    fee: randomFee(),
    status: randomOrderStatus(),
    side: randomOrderSide(),
    pairName: randomPair(),
    amount: randomAmount(),
    price: randomPrice(),
    createdAt: randomTimestamp(),
  }

  if (order.status === 'CANCELED') {
    order.filledAmount = 0
  } else if (order.status === 'PARTIALLY_FILLED') {
    order.filledAmount = order.amount * randomRatio()
  } else if (order.status === 'EXECUTED') {
    order.filledAmount = order.amount
  }

  order.buyAmount = order.amount
  order.sellAmount = order.amount * order.price
  orderHistory.push(order)
}

fs.writeFile('orders.json', JSON.stringify(orderHistory), 'utf8', err => {
  if (err) return console.log(err)
  console.log('File saved')
})
