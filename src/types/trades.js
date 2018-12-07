//@flow
import type { Signature } from './common';

export type Trade = {
  time: number,
  price: number,
  amount: number,
  tradeNonce: number,
  hash: string,
  orderHash: string,
  status: 'SUCCESS' | 'EXECUTED' | 'ERROR' | 'PENDING',
  type: 'MARKET' | 'LIMIT',
  side: 'BUY' | 'SELL',
  pair: string,
  maker: string,
  taker: string,
  signature: Signature
};

export type Trades = Array<Trade>;

export type TradesState = {
  byHash: { [key: string]: Trade }
};
