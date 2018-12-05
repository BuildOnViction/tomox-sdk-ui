import { utils } from 'ethers';
import { ether } from './constants';

/**
 * for Example ETH => WEI
 * @param value
 * @param decimals
 * @returns {string}
 */
export function convertToUnit(value, decimals, format) {
  if (format === 'string') {
    return (
      Math.floor(parseFloat(value) * Math.pow(10, parseInt(decimals, 10))) /
      Math.pow(10, parseInt(decimals, 10))
    ).toString();
  } else if (format === 'int') {
    return (
      Math.floor(parseFloat(value) * Math.pow(10, parseInt(decimals, 10))) /
      Math.pow(10, parseInt(decimals, 10))
    ).toString();
  } else {
    return parseFloat(value) * Math.pow(10, parseInt(decimals, 10));
  }
}

export function round(value, decimals, format = 'float') {
  if (format === 'string') {
    return (
      Math.floor(parseFloat(value) * Math.pow(10, parseInt(decimals, 10))) /
      Math.pow(10, parseInt(decimals, 10))
    ).toString();
  } else if (format === 'int') {
    return (
      Math.floor(parseFloat(value) * Math.pow(10, parseInt(decimals, 10))) /
      Math.pow(10, parseInt(decimals, 10))
    );
  } else {
    return (
      Math.floor(parseFloat(value) * Math.pow(10, parseInt(decimals, 10))) /
      Math.pow(10, parseInt(decimals, 10))
    );
  }
}

export function roundingNumber(number) {
  var MAX_DIGIS = 7, SIZE = 3;
  number = +number;
  let numberStr = number.toString();
  if (isNaN(number) || number <= 0) number = 0;
  if (number < 1e-7) number = 0;
  if (('' + Math.floor(number)).length >= MAX_DIGIS) {
    return Math.floor(number).toLocaleString();
  }

  let count_0 = 0
  for (let j of numberStr) {
    if(j === '.') continue
    if(j === 0) 
      count_0++ 
    else 
      break
  }

  let minDisplay = MAX_DIGIS - count_0 < 4? 4: MAX_DIGIS - count_0

  let precision = number.toPrecision((number < 1 && number > 0) ? minDisplay : MAX_DIGIS),
    arr = precision.split('.'),
    intPart = arr[0],
    i = intPart.length % SIZE || SIZE,
    result = intPart.substr(0, i);

  for (; i < intPart.length; i += SIZE) {
    result += ',' + intPart.substr(i, SIZE);
  }
  if (arr[1]) {
    result += '.' + arr[1];
  }
  return result;
}

export function reduceDecimals(value, decimals, format = 'float') {
  if (format === 'string') {
    return (
      Math.floor(parseFloat(value) * Math.pow(10, parseInt(decimals, 10))) /
      Math.pow(10, parseInt(decimals, 10))
    ).toString();
  } else if (format === 'int') {
    return (
      Math.floor(parseFloat(value) * Math.pow(10, parseInt(decimals, 10))) /
      Math.pow(10, parseInt(decimals, 10))
    );
  } else {
    return (
      Math.floor(parseFloat(value) * Math.pow(10, parseInt(decimals, 10))) /
      Math.pow(10, parseInt(decimals, 10))
    );
  }
}

export function toDate(timeStamp) {
  return new Date(timeStamp).toLocaleDateString().replace(/\//g, '-');
}

export function toWEI(number) {
  const bigNumber = utils.BigNumber.isBigNumber(number)
    ? number
    : utils.bigNumberify();
  return bigNumber.mul(ether);
}
