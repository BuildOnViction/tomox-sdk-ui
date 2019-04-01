// @flow
import React from 'react'
import OrderListRenderer from './OrderListRenderer'
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
    const { bids, asks, latestTrade } = this.props
    asks.reverse()

    return (
      <OrderListRenderer bids={bids} asks={asks} latestTrade={latestTrade} />
    )
  }
}

export default OrderBook
