import { utils } from 'ethers';
// import type { BN, Numberish } from '../types/common';

import ethereum_address from 'ethereum-address';
import { formatRelative } from 'date-fns';

export const rand = (min, max, decimals = 4) => {
  return (Math.random() * (max - min) + min).toFixed(decimals);
};

export const randInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const relativeDate = (time: number) => {
  let formattedDate = formatRelative(time, new Date());
  return capitalizeFirstLetter(formattedDate);
};

export const isFloat = n => parseFloat(n.match(/^-?\d*(\.\d+)?$/)) > 0;

export const isInteger = n => /^\+?\d+$/.test(n);

export const round = (n, decimals = '2') =>
  Math.round(n * Math.pow(10, decimals)) / Math.pow(10, decimals);

export const convertPricepointToPrice = (
  n,
  pricePointMultiplier = 1e9,
  decimals = 6
) => {
  const price =
    Math.round((n / pricePointMultiplier) * Math.pow(10, decimals)) /
    Math.pow(10, decimals);
  // console.log(pricePointMultiplier, price);
  return price;
};
export const sortTable = (
  table,
  column,
  order: (a, b) => number | string = 'order'
) => {
  const compareFn =
    typeof order === 'function' ? order : (a, b) => compare(a, b, order);
  return table.sort((a, b) => compareFn(a[column], b[column]));
};

export const compare = (a, b, order = 'asc') => {
  // console.log(a, b);
  if (typeof a === 'string' && typeof b === 'string') {
    a = a.toUpperCase();
    b = b.toUpperCase();
  }

  return order === 'asc' ? (a < b ? -1 : 1) : a < b ? 1 : -1;
};

export const filterer = (filter, coin, wrt, filterValue) => {
  if (filter) {
    return coin[wrt] === filterValue;
  }
  return true;
};

export const isJson = text => {
  return /^[\],:{}\s]*$/.test(
    text // eslint-disable-next-line
      .replace(/\\["\\\/bfnrtu]/g, '@') // eslint-disable-next-line
      .replace(
        /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g,
        ']'
      )
      .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
  );
};

export function toPassowrdType(text) {
  if (typeof text === 'string' || typeof text === 'number') {
    return '*'.repeat(text.length);
  }
  return text;
}

export function getSessionStorageWallets() {
  let wallets = [{ address: 'Enter new...', key: '', rank: 0 }],
    index = 1;
  Object.keys(sessionStorage).map(key => {
    if (ethereum_address.isAddress(key)) {
      wallets.push({ address: key, key: sessionStorage[key], rank: index });
      index++;
    }
    return key;
  });
  return wallets;
}

export function getLocalStorageWallets() {
  let wallets = [{ address: 'Enter new...', key: '', rank: 0 }],
    index = 1;
  Object.keys(localStorage).map(key => {
    if (ethereum_address.isAddress(key) && isJson(localStorage[key])) {
      wallets.push({ address: key, key: localStorage[key], rank: index });
      index++;
    }
    return key;
  });
  return wallets;
}

export function passTimestamp(key) {
  if (typeof key === 'string') {
    return new Date(key).getTime();
  }
  if (Object.prototype.toString.call(key) === '[object Date]') {
    return key.getTime();
  }
  return key;
}

export const computeTokenAmount = (amount: Object, tokenDecimals: number) => {
  return utils
    .bigNumberify(amount)
    .div(utils.bigNumberify(10).pow(tokenDecimals))
    .toString();
};

export const computePricepoint = ({
  price,
  priceMultiplier,
  quoteMultiplier,
  precisionMultiplier
}: *) => {
  let a = price * precisionMultiplier;
  let b = a.toFixed(0);
  let c = utils.bigNumberify(b);
  let d = c
    .mul(priceMultiplier)
    .mul(quoteMultiplier)
    .div(precisionMultiplier);

  return d;
};

export const computeAmountPoints = ({
  amount,
  baseMultiplier,
  precisionMultiplier
}: *) => {
  let a = amount * precisionMultiplier;
  let b = a.toFixed(0);
  let c = utils.bigNumberify(b);
  let d = c.mul(baseMultiplier).div(precisionMultiplier);

  return d;
};

export const computePairMultiplier = ({
  priceMultiplier,
  baseMultiplier,
  quoteMultiplier
}: *) => {
  return priceMultiplier.mul(baseMultiplier);
};

export const max = (a: Object, b: Object) => {
  let bigA = utils.bigNumberify(a);
  let bigB = utils.bigNumberify(b);

  if (bigA.gte(bigB)) {
    return bigA;
  } else {
    return bigB;
  }
};

export const min = (a: Object, b: Object) => {
  let bigA = utils.bigNumberify(a);
  let bigB = utils.bigNumberify(b);

  if (bigA.lte(bigB)) {
    return bigA;
  } else {
    return bigB;
  }
};

export const minOrderAmount = (makeFee: string, takeFee: string) => {
  let bigMakeFee = utils.bigNumberify(makeFee);
  let bigTakeFee = utils.bigNumberify(takeFee);
  let minAmount = bigMakeFee.mul(2).add(bigTakeFee.mul(2));

  return minAmount;
};
