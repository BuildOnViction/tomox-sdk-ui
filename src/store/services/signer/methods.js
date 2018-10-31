import { utils } from 'ethers';
import { getOrderHash, getOrderCancelHash, getTradeHash } from '../../../utils/crypto';
import { createRawOrder as orderCreateRawOrder } from '../orders';

export const createRawOrder = function(params) {
  return orderCreateRawOrder(this, params);
};

export const createOrderCancel = async function(orderHash) {
  let orderCancel = {};
  orderCancel.orderHash = orderHash;
  orderCancel.hash = getOrderCancelHash(orderCancel);

  let signature = await this.signMessage(utils.arrayify(orderCancel.hash));
  let { r, s, v } = utils.splitSignature(signature);
  orderCancel.signature = { R: r, S: s, V: v };

  return orderCancel;
};

export const signOrder = async function(order) {
  order.hash = getOrderHash(order);

  let signature = await this.signMessage(utils.arrayify(order.hash));
  let { r, s, v } = utils.splitSignature(signature);

  order.signature = { R: r, S: s, V: v };
  return order;
};

export const signTrade = async function(trade) {
  trade.hash = getTradeHash(trade);

  let signature = await this.signMessage(utils.arrayify(trade.hash));
  let { r, s, v } = utils.splitSignature(signature);

  trade.signature = { R: r, S: s, V: v };
  return trade;
};
