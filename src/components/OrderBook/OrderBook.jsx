// @flow
import React from 'react'
import OrderListRenderer from './OrderListRenderer'
import type { TokenPair } from '../../types/tokens'

type BidOrAsk = {
  price: number,
  amount: number,
  total: number
};

type Props = {
  loading: boolean,
  asks: Array<BidOrAsk>,
  bids: Array<BidOrAsk>,
  currentPair: TokenPair
};

class OrderBook extends React.Component<Props, State> {
  render() {
    const { bids, asks } = this.props
    asks.reverse()

    return (
      <OrderListRenderer bids={bids} asks={asks} />
    )
  }
}

export default OrderBook
