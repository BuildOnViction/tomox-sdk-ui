import { utils } from 'ethers';
import { ether } from './constants';

/**
 * for Example TOMO => WEI
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
