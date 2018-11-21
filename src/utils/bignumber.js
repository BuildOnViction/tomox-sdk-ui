import { utils } from 'ethers'
import { ether } from './constants'

export const decimalUnit = utils.bigNumberify('10');

export const max = (a, b) => {
  return a.gt(b) ? a : b;
}

export const min = (a, b) => {
  return b.gt(a) ? b : a;
}

export const convertToWei = (amount, decimals = 18): string => {
  if (!amount) return "0";
  const amountStr = typeof amount === 'string' ? amount : amount.toString();
  let decimalsUnit = utils.bigNumberify(decimals)
  let decimalsMultiplier = decimalUnit.pow(decimalsUnit);
  let bigAmount = utils
    .bigNumberify(amountStr)
    .mul(decimalsMultiplier);

  return bigAmount.toString();
}

export const fromWeiToFloat = (amount, decimals = 2): number => {
  if (!amount) return 0.0  
  const amountStr = typeof amount === 'string' ? amount : amount.toString();
  let decimalsMultiplier = utils.bigNumberify(10 ** decimals);
  let bigAmount = utils
    .parseEther(amountStr)
    .mul(decimalsMultiplier)
    .div(ether);

  return Number(bigAmount) / Number(decimalsMultiplier);
}
