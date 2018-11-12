//@flow
import type { Signature } from './common'

import type { TokenPair } from './tokens'

export type NewOrderParams = {
  userAddress: string,
  exchangeAddress: string,
  pair: TokenPair,
  amount: number,
  price: number,
  side: 'BUY' | 'SELL'
}

export type NewRawOrderParams = NewOrderParams & {
  makeFee: string,
  takeFee: string
}

export type RawOrder = {
  userAddress: string,
  exchangeAddress: string,
  buyTokenAddress: string,
  sellTokenAddress: string,
  buyAmount: string,
  sellAmount: string,
  hash: string,
  signature: Signature,
  nonce: string,
  expires: string,
  makeFee: string,
  takeFee: string
}

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
  status: 'NEW' | 'OPEN' | 'CANCELLED' | 'FILLED' | 'PARTIALLY_FILLED'
}

// eslint-disable-next-line
export type Orders = Array<Order>

// eslint-disable-next-line
export type OrdersState = {
  byTimestamp: { [key: string]: Order }
}
