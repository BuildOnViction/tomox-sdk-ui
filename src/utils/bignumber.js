import { utils } from 'ethers'
import { ether } from './constants'

export const max = (a, b) => {
  return a.gt(b) ? a : b
}

export const min = (a, b) => {
  return b.gt(a) ? b : a
}

export const fromWeiToFloat = (amount, decimals = 2): number => {
  if (!amount) return 0.0
  const amountStr = typeof amount === 'string' ? amount : amount.toString()
  let decimalsMultiplier = utils.bigNumberify(10 ** decimals)
  let bigAmount = utils
    .parseEther(amountStr)
    .mul(decimalsMultiplier)
    .div(ether)

  return Number(bigAmount) / Number(decimalsMultiplier)
}
