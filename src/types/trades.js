//@flow
export type Trade = {
  time: number,
  price: number,
  amount: number,
  hash: string,
  orderHash: string,
  takerOrderHash: string,
  status: 'SUCCESS' | 'ERROR' | 'PENDING',
  type: 'MARKET' | 'LIMIT',
  side: 'BUY' | 'SELL',
  pair: string,
  maker: string,
  taker: string,
}

export type Trades = Array<Trade>

export type TradesState = {
  byHash: { [key: string]: Trade }
}
