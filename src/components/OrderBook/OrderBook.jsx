// @flow
import React from 'react'
import OrderListRenderer from './OrderBookRenderer'
import type { TokenPair, Trade } from '../../types/tokens'
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
    pricePrecision: 4,
    amountPrecision: 4,
    decimals: this.props.decimals,
  }

  componentDidUpdate(prevProps) {
    
    if (!prevProps.currentPairData && this.props.currentPairData) {
      this.setState({
        decimals: this.props.currentPairData.pricePrecision,
      })

      this.props.updateDecimals(this.props.currentPairData.pricePrecision)
    }

    if (this.props.currentPairData && (
      this.props.currentPairData.pricePrecision !== this.state.pricePrecision
      || this.props.currentPairData.amountPrecision !== this.state.amountPrecision)) {
      this.setState({
        pricePrecision: this.props.currentPairData.pricePrecision,
        amountPrecision: this.props.currentPairData.amountPrecision,
        decimals: this.props.currentPairData.pricePrecision,
      })

      this.props.updateDecimals(this.props.currentPairData.pricePrecision)
    }
  }

  handleChangePricePrecision = (precision) => {
    this.setState({ decimals: precision.value })
    this.props.updateDecimals(precision.value)
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
        decimals,
      },
      handleChangePricePrecision,
    }
    = this
    
    const reversedAsks = asks.slice().reverse()
    const asksFilteredZeroAmount = filterZeroAmount(reversedAsks, amountPrecision)
    const bidsFilteredZeroAmount = filterZeroAmount(bids, amountPrecision)

    const pricePrecisionsList = []
    // Reference https://stackoverflow.com/questions/31001901/how-to-count-the-number-of-zero-decimals-in-javascript
    let start = currentPairData ? -Math.floor( Math.log(currentPairData.price) / Math.log(10) + 1) : 0
    start = Math.max(start, 0)

    for (let i = start; i <= pricePrecision; i++) {
      pricePrecisionsList.push(i)
    }

    return (
      <OrderListRenderer 
        bids={bidsFilteredZeroAmount} 
        asks={asksFilteredZeroAmount} 
        onSelect={select}
        pricePrecisionsList={pricePrecisionsList}
        pricePrecision={pricePrecision}
        currentPricePrecision={decimals}
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
