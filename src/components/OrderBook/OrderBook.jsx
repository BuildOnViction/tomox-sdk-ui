// @flow
import React from 'react'
import OrderListRenderer from './OrderBookRenderer'
import type { TokenPair, Trade } from '../../types/tokens'
import { pricePrecision, pricePrecisionsList } from '../../config/tokens'

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

class OrderBook extends React.Component<Props, State> {
  state = {
    pricePrecision,
  }

  handleChangePricePrecision = (precision) => {
    this.setState({
      pricePrecision: precision.value,
    })
  }

  render() {
    const {
      props: { 
        bids, 
        asks,
        select,
        currentPairData,
        referenceCurrency,
      },
      state: { 
        pricePrecision,
      },
      handleChangePricePrecision,
    }
    = this

    return (
      <OrderListRenderer 
        bids={bids} 
        asks={asks.reverse()} 
        onSelect={select}
        pricePrecisionsList={pricePrecisionsList}
        pricePrecision={pricePrecision}
        onChangePricePrecision={handleChangePricePrecision}
        currentPairData={currentPairData}
        referenceCurrency={referenceCurrency} />
    )
  }
}

export default OrderBook
