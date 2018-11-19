//@flow
import type { Signature } from './common';

import type { TokenPair } from './tokens';

export type NewOrderParams = {
  userAddress: string,
  exchangeAddress: string,
  pair: TokenPair,
  amount: number,
  price: number,
  makeFee: string,
  takeFee: string,
  side: 'BUY' | 'SELL'
};

export type RawOrder = {
  exchangeAddress: string,
  userAddress: string,
  baseToken: string,
  quoteToken: string,
  amount: string,
  pricepoint: string,
  side: 'BUY' | 'SELL',
  nonce: string,
  makeFee: string,
  takeFee: string,
  status: string,
  hash: string,
  signature: Signature
};

export type OrderCancel = {
  orderHash: string,
  hash: string,
  signature: Signature
};

export type Order = {
  time: number,
  amount: number,
  filled: number,
  price: number,
  price: number,
  hash: string,
  side: 'BUY' | 'SELL',
  pair: string,
  type: 'MARKET' | 'LIMIT',
  status: 'NEW' | 'OPEN' | 'CANCELLED' | 'FILLED' | 'PARTIALLY_FILLED',
  cancellable: boolean
};

// eslint-disable-next-line
export type Orders = Array<Order>;

// eslint-disable-next-line
export type OrdersState = {
  byHash: { [key: string]: Order }
};
