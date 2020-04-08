// @flow
import React from 'react'
import OrderListRenderer from './OrderBookRenderer'
import type { TokenPair, Trade } from '../../../types/tokens'
import BigNumber from 'bignumber.js'

BigNumber.config({ ROUNDING_MODE: 1 })

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

type State = {
  pricePrecision: number
}

const filterZeroAmount = (list, amountPrecision) => {
  return list.filter(item => {
    return Number(BigNumber(item.amount).toFixed(amountPrecision)) > 0
  })
}

class OrderBook extends React.Component<Props, State> {
  state = {
    pricePrecision: 2,
    amountPrecision: 2,
  }

  render() {
    const {
      props: { 
        bids, 
        asks,
        selectOrder,
        currentPair,
        currentPairData,
      },
      state: { 
        pricePrecision,
        amountPrecision,
      },
    }
    = this

    const reversedAsks = asks.slice().reverse()
    const asksFilteredZeroAmount = filterZeroAmount(reversedAsks, amountPrecision)
    const bidsFilteredZeroAmount = filterZeroAmount(bids, amountPrecision)

    return (
      <OrderListRenderer 
        bids={bidsFilteredZeroAmount} 
        asks={asksFilteredZeroAmount} 
        onSelect={selectOrder}
        pricePrecision={pricePrecision}
        amountPrecision={amountPrecision}
        currentPairData={currentPairData}
        currentPair={currentPair}
      />
    )
  }
}

export default OrderBook
