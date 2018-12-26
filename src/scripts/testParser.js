const { utils } = require('ethers')

const defaultDecimals = 18
const amountPrecision = 3

const parseTokenAmount = (
  amount,
  tokenDecimals = defaultDecimals,
  precision = amountPrecision
) => {
  const precisionMultiplier = utils.bigNumberify(10).pow(precision)
  const baseMultiplier = utils.bigNumberify(10).pow(tokenDecimals)
  const bigAmount = utils
    .bigNumberify(amount)
    .mul(precisionMultiplier)
    .div(baseMultiplier)

  return Number(bigAmount) / Number(precisionMultiplier)
}

console.log(parseTokenAmount("1000000000000000000000"))
