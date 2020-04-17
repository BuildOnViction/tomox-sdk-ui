// @flow
import React from 'react'
import TradesTableRenderer from './TradesTableRenderer'
import type { Trade } from '../../../types/trades'
import type { TokenPair } from '../../../types/tokens'
import { calcPrecision } from '../../../utils/helpers'
import { pricePrecision as defaultPricePrecision, amountPrecision as defaultAmountPrecision } from '../../../config/tokens'

type State = {
  selectedTabId: string,
  isOpen: boolean
};

type Props = {
  trades: Array<Trade>,
  currentPair: TokenPair
};

class TradesTable extends React.PureComponent<Props, State> {


  render() {
    const {
      props: { trades, currentPair },
    } = this
    // should order or filter?
    const sortedMarketTradeHistory = trades
    let pricePrecision = defaultPricePrecision
    let amountPrecision = defaultAmountPrecision
    if (sortedMarketTradeHistory.length > 0) {
      const precision = calcPrecision(sortedMarketTradeHistory[0].price)
      pricePrecision = precision.pricePrecision
      amountPrecision = precision.amountPrecision
    }

    return (
      <TradesTableRenderer
        currentPair={currentPair}
        trades={sortedMarketTradeHistory}
        pricePrecision={pricePrecision}
        amountPrecision={amountPrecision}
      />
    )
  }
}

export default TradesTable
