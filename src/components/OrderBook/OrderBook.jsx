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
    currentPricePrecision: 4,
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentPairData && (
      this.props.currentPairData.pricePrecision !== this.state.pricePrecision
      || this.props.currentPairData.amountPrecision !== this.state.amountPrecision)) {
      this.setState({
        pricePrecision: this.props.currentPairData.pricePrecision,
        amountPrecision: this.props.currentPairData.amountPrecision,
        currentPricePrecision: this.props.currentPairData.pricePrecision,
      })
    }
  }

  handleChangePricePrecision = (precision) => {
    this.setState({
      currentPricePrecision: precision.value,
    })
  }

  render() {
    const {
      props: { 
        bids, 
        asks,
        select,
        currentPair: {
          baseTokenSymbol,
          quoteTokenSymbol,
        },
        currentPairData,
        referenceCurrency,
      },
      state: { 
        pricePrecision,
        amountPrecision,
        currentPricePrecision,
      },
      handleChangePricePrecision,
    }
    = this

    const reversedAsks = asks.slice().reverse()
    const pricePrecisionsList = []
    for (let i = 0; i <= pricePrecision; i++) {
      pricePrecisionsList.push(i)
    }

    return (
      <OrderListRenderer 
        bids={bids} 
        asks={reversedAsks} 
        onSelect={select}
        pricePrecisionsList={pricePrecisionsList}
        pricePrecision={pricePrecision}
        currentPricePrecision={currentPricePrecision}
        amountPrecision={amountPrecision}
        onChangePricePrecision={handleChangePricePrecision}
        currentPairData={currentPairData}
        referenceCurrency={referenceCurrency}
        baseTokenSymbol={baseTokenSymbol}
        quoteTokenSymbol={quoteTokenSymbol} />
    )
  }
}

export default OrderBook
