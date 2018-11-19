//@flow

import {
  utils
} from 'ethers';
import {
  getOrderHash,
  getTradeHash,
  getRandomNonce
} from '../../utils/crypto';
import {
  EXCHANGE_ADDRESS
} from '../../config/contracts';
import {
  round
} from '../../utils/helpers';
import {
  ether
} from '../../utils/constants';
// flow
import type {
  NewOrderParams,
  RawOrder
} from '../../types/orders';
import type {
  Signer
} from '../../types/signer';
import type {
  Trade
} from '../../types/trades';

/**
 * In the future, this order will be send to swarm feed
 * @param {Object} params
 * @param {Signer} signer
 */

export const createRawOrder = async function (
  signer: Signer,
  params: NewOrderParams
): Promise < RawOrder > {
  let order = {};
  let {
    userAddress,
    side,
    pair,
    amount,
    price,
    makeFee,
    takeFee
  } = params;
  let {
    baseTokenDecimals,
    quoteTokenDecimals,
    baseTokenAddress,
    quoteTokenAddress
  } = pair;
  let exchangeAddress = EXCHANGE_ADDRESS[signer.provider.network.chainId];

  if (baseTokenDecimals < quoteTokenDecimals) throw Error('Pair currently not supported (decimals error)')

  // The amountPrecisionMultiplier and pricePrecisionMultiplier are temporary multipliers
  // that are used to turn decimal values into rounded integers that can be converted into
  // big numbers that can be used to compute large amounts (ex: in wei) with the amountMultiplier
  // and priceMultiplier. After multiplying with amountMultiplier and priceMultiplier, the result
  // numbers are divided by the precision multipliers.
  // So in the end we have:
  // amountPoints ~ amount * amountMultiplier ~ amount * 1e18
  // pricePoints ~ price * priceMultiplier ~ price * 1e6
  let amountPrecisionMultiplier = 1e6;
  let pricePrecisionMultiplier = 1e9;

  // let amountMultiplier = ether; //1e18
  let priceMultiplier = utils.bigNumberify('1000000000'); //1e9

  let decimalsPriceMultiplier = utils.bigNumberify((10 ** (baseTokenDecimals - quoteTokenDecimals)).toString())
  let amountMultiplier = utils.bigNumberify((10 ** baseTokenDecimals).toString())


  amount = round(amount * amountPrecisionMultiplier, 0);
  price = round(price * pricePrecisionMultiplier, 0);

  let amountPoints = utils
    .bigNumberify(amount)
    .mul(amountMultiplier)
    .div(utils.bigNumberify(amountPrecisionMultiplier));
  let pricepoint = utils
    .bigNumberify(price)
    .mul(priceMultiplier)
    .div(utils.bigNumberify(pricePrecisionMultiplier));

  order.exchangeAddress = exchangeAddress;
  order.userAddress = userAddress;
  order.baseToken = baseTokenAddress;
  order.quoteToken = quoteTokenAddress;
  order.amount = amountPoints.toString();
  order.pricepoint = pricepoint.toString();
  order.side = side;
  order.makeFee = makeFee;
  order.takeFee = takeFee;
  order.nonce = getRandomNonce();
  order.hash = getOrderHash(order);

  // new order
  order.status = 'NEW';

  let signature = await signer.signMessage(utils.arrayify(order.hash));
  let {
    r,
    s,
    v
  } = utils.splitSignature(signature);
  order.signature = {
    r,
    s,
    v
  };

  return order;
};

// export const createRawOrder = async (signer, params) => {
//   let order = {};
//   let { userAddress, side, pair, amount, price, makeFee, takeFee } = params;
//   let { baseTokenAddress, quoteTokenAddress } = pair;
//   let exchangeAddress = EXCHANGE_ADDRESS[signer.provider.network.chainId];

//   // The amountPrecisionMultiplier and pricePrecisionMultiplier are temporary multipliers
//   // that are used to turn decimal values into rounded integers that can be converted into
//   // big numbers that can be used to compute large amounts (ex: in wei) with the amountMultiplier
//   // and priceMultiplier. After multiplying with amountMultiplier and priceMultiplier, the result
//   // numbers are divided by the precision multipliers.
//   // So in the end we have:
//   // amountPoints ~ amount * amountMultiplier ~ amount * 1e18
//   // pricePoints ~ price * priceMultiplier ~ price * 1e6
//   let amountPrecisionMultiplier = 1e6;
//   let pricePrecisionMultiplier = 1e6;
//   let amountMultiplier = ether; //1e18
//   let priceMultiplier = utils.bigNumberify('1000000'); //1e6
//   amount = round(amount * amountPrecisionMultiplier, 0);
//   price = round(price * pricePrecisionMultiplier, 0);

//   let amountPoints = utils
//     .bigNumberify(amount)
//     .mul(amountMultiplier)
//     .div(utils.bigNumberify(amountPrecisionMultiplier));
//   let pricePoints = utils
//     .bigNumberify(price)
//     .mul(priceMultiplier)
//     .div(utils.bigNumberify(pricePrecisionMultiplier));

//   order.userAddress = userAddress;
//   order.exchangeAddress = exchangeAddress;
//   if (side === 'BUY') {
//     order.buyToken = baseTokenAddress;
//     order.buyAmount = amountPoints.toString();

//     order.sellToken = quoteTokenAddress;
//     order.sellAmount = amountPoints
//       .mul(pricePoints)
//       .div(priceMultiplier)
//       .toString();
//   } else {
//     order.buyToken = quoteTokenAddress;
//     order.buyAmount = amountPoints
//       .mul(pricePoints)
//       .div(priceMultiplier)
//       .toString();

//     order.sellToken = baseTokenAddress;
//     order.sellAmount = amountPoints.toString();
//   }

//   order.makeFee = makeFee;
//   order.takeFee = takeFee;
//   order.nonce = getRandomNonce();
//   order.expires = '10000000000000';
//   order.hash = getOrderHash(order);

//   let signature = await signer.signMessage(utils.arrayify(order.hash));
//   let { r, s, v } = utils.splitSignature(signature);
//   order.signature = { R: r, S: s, V: v };
//   return order;
// };

export const validateOrderHash = (hash: string, order: RawOrder): boolean => {
  let computedHash = getOrderHash(order);

  return computedHash !== hash ? false : true;
};

export const validateTradeHash = (hash: string, trade: Trade): boolean => {
  let computedHash = getTradeHash(trade);

  return computedHash !== hash ? false : true;
};

// We currently assume that the order is already signed
export const signOrder = async (signer: Signer, order: RawOrder) => {
  let computedHash = getOrderHash(order);
  if (order.hash !== computedHash) throw new Error('Invalid Hash');

  let signature = await signer.signMessage(utils.arrayify(order.hash));
  let {
    r,
    s,
    v
  } = utils.splitSignature(signature);

  order.signature = {
    r,
    s,
    v
  };
  return order;
};

export const signTrade = async (signer: Signer, trade: Trade) => {
  let computedHash = getTradeHash(trade);
  if (trade.hash !== computedHash) throw new Error('Invalid Hash');

  let signature = await signer.signMessage(utils.arrayify(trade.hash));
  let {
    r,
    s,
    v
  } = utils.splitSignature(signature);

  trade.signature = {
    r,
    s,
    v
  };
  return trade;
};