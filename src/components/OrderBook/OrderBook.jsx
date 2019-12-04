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

type State = {
  pricePrecision: number
}

class OrderBook extends React.Component<Props, State> {
  state = {
    pricePrecision: 4,
    amountPrecision: 4,
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.currentPairData && this.props.currentPairData) {
      this.setState({
        pricePrecision: this.props.currentPairData.pricePrecision,
        amountPrecision: this.props.currentPairData.amountPrecision,
      })
    }
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
        amountPrecision,
      },
      handleChangePricePrecision,
    }
    = this

    const pricePrecisionsList = []
    for (let i = 0; i < pricePrecision; i++) {
      pricePrecisionsList.push(i)
    }

    return (
      <OrderListRenderer 
        bids={bids} 
        asks={asks.reverse()} 
        onSelect={select}
        pricePrecisionsList={pricePrecisionsList}
        pricePrecision={pricePrecision}
        amountPrecision={amountPrecision}
        onChangePricePrecision={handleChangePricePrecision}
        currentPairData={currentPairData}
        referenceCurrency={referenceCurrency} />
    )
  }
}

export default OrderBook
