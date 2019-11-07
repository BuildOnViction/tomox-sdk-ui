import fs from 'fs'
import { rand, randInt, round } from '../utils/helpers'
import { format } from 'date-fns'
// import tokenPairs from '../jsons/tokenPairs.json'
import { utils } from 'ethers'

const trades = []
const buys = []
const sells = []
// const { pairs } = tokenPairs
const minTimeStamp = 1519990000000
const maxTimeStamp = 1520000000000
const minAmount = 1
const maxAmount = 100
const minPrice = 380
const middlePrice = 400
const maxPrice = 420

console.log(format(new Date(maxTimeStamp), 'DD/MM/YYYY HH:MM:SS Z '))
console.log(format(new Date(minTimeStamp), 'DD/MM/YYYY HH:MM:SS Z '))
const randomOrderSide = () => (randInt(0, 1) === 1 ? 'BUY' : 'SELL')
const randomOrderType = () => ['MARKET', 'LIMIT'][randInt(0, 1)]
// const randomPair = () => pairs[randInt(0, 5)]
const randomAmount = () => rand(minAmount, maxAmount)
const randomTimestamp = () => randInt(minTimeStamp, maxTimeStamp)
const randomPrice = () => rand(minPrice, maxPrice)
const randomBidPrice = () => rand(minPrice, middlePrice)
const randomAskPrice = () => rand(middlePrice, maxPrice)
const randomHash = () => utils.sha256(utils.randomBytes(100))
const randomAddress = () => randomHash().slice(0, 42)
const roundToInteger = () => rand(0, 1) / 0.2 > 1

const tradesNumber = rand(100, 200)
const buyNumber = rand(100, 200)
const sellNumber = rand(100, 200)

for (let i = 0; i < tradesNumber; i++) {
  const order = {
    amount: roundToInteger() ? round(randomAmount(), 0) : round(randomAmount(), 2),
    price: randomPrice(),
    type: randomOrderType(),
    side: randomOrderSide(),
    hash: randomHash(),
    orderHash: randomHash(),
    taker: randomAddress(),
    maker: randomAddress(),
    pairName: 'DAI_WETH',
    createdAt: randomTimestamp(),
  }

  trades.push(order)
}

for (let i = 0; i < buyNumber; i++) {
  const buy = {
    price: randomBidPrice(),
    volume: roundToInteger() ? round(randomAmount(), 0) : round(randomAmount(), 2),
  }

  buys.push(buy)
}

for (let i = 0; i < sellNumber; i++) {
  const sell = {
    price: randomAskPrice(),
    volume: roundToInteger() ? round(randomAmount(), 0) : round(randomAmount(), 2),
  }

  sells.push(sell)
}

const orderBookData = {
  buys,
  sells,
  trades,
}

fs.writeFile('orderBookData.json', JSON.stringify(orderBookData), 'utf8', err => {
  if (err) return console.log(err)
  console.log('File saved')
})
