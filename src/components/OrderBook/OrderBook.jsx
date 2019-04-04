// @flow
import React from 'react'
import OrderListRenderer from './OrderBookRenderer'
import type { TokenPair, Trade } from '../../types/tokens'

type BidOrAsk = {
  price: number,
  amount: number,
  total: number
};

type Props = {
  loading: boolean,
  asks: Array<BidOrAsk>,
  bids: Array<BidOrAsk>,
  currentPair: TokenPair,
  latestTrade: Trade,
};

class OrderBook extends React.Component<Props, State> {
  render() {
    const { 
      bids, 
      asks,
      select,
      latestTrade,
    } = this.props

    return (
      <OrderListRenderer 
        bids={bids} 
        asks={asks.reverse()} 
        onSelect={select} 
        latestTrade={latestTrade} />
    )
  }
}

export default OrderBook
