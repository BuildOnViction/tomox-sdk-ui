// @flow
import React from 'react'
import { unformat } from 'accounting-js'
import DepthChartRenderer from './DepthChartRenderer'
import BigNumber from 'bignumber.js'
import { pricePrecision as defaultPricePrecision, amountPrecision as defaultAmountPrecision } from '../../config/tokens'

BigNumber.config({ ROUNDING_MODE: 3 }) // The round is floor
const AmCharts = require('@amcharts/amcharts3-react')

type BidOrAsk = {
  price: number,
  amount: number,
  total: number
};

type Props = {
  asks: Array<BidOrAsk>,
  bids: Array<BidOrAsk>,
};

class DepthChart extends React.Component<Props, State> {
  state = {
    pricePrecision: defaultPricePrecision,
    amountPrecision: defaultAmountPrecision,
  }

  componentDidUpdate() {
    const { pricePrecision, amountPrecision } = this.state
    const { currentPairData } = this.props
    
    if (currentPairData && (
      (currentPairData.pricePrecision !== pricePrecision)
      || (currentPairData.amountPrecision !== amountPrecision)
    )) {
      this.setState({
        pricePrecision: currentPairData.pricePrecision,
        amountPrecision: currentPairData.amountPrecision,
      })
    }
  }
  
  formatNumber = (val: string, chart: Object, precision: number) => {
    return AmCharts.formatNumber(unformat(val), {
      precision: precision ? precision : chart.precision,
      decimalSeparator: chart.decimalSeparator,
      thousandsSeparator: chart.thousandsSeparator,
    })
  }

  processData = (list: Array<BidOrAsk>, pricePrecision: number, amountPrecision: number, type: string) => {
    return list.map(item => {
      item['price'] = BigNumber(item.price).toFixed(pricePrecision)
      item['amount'] = BigNumber(item.amount).toFixed(amountPrecision)
      item['total'] = BigNumber(item.total).toFixed(defaultAmountPrecision)      
      item[`${type}amount`] = BigNumber(item.amount).toFixed(amountPrecision)
      item[`${type}total`] = BigNumber(item.total).toFixed(defaultAmountPrecision)
      return item
    })
  }

  toolTip = (item: Object, graph: Object) => {
    const { pricePrecision, amountPrecision } = this.state
    let txt
    if (graph.id === 'asks') {
      txt = `Sell price: <strong>${this.formatNumber(
        item.dataContext.price,
        graph.chart,
        pricePrecision,
      )}</strong><br />
      Amount: <strong>${this.formatNumber(
        item.dataContext.amount,
        graph.chart,
        amountPrecision,
      )}</strong><br />
      Total: <strong>${this.formatNumber(
        item.dataContext.total,
        graph.chart,
        defaultAmountPrecision,
      )}</strong>`
    } else {
      txt = `Buy price: <strong>${this.formatNumber(
        item.dataContext.price,
        graph.chart,
        pricePrecision,
      )}</strong><br />
      Amount: <strong>${this.formatNumber(
        item.dataContext.amount,
        graph.chart,
        amountPrecision,
      )}</strong><br />
      Total: <strong>${this.formatNumber(
        item.dataContext.total,
        graph.chart,
        defaultAmountPrecision,
      )}</strong>
      `
    }
    return txt
  };

  render() {
    let { bids, asks} = this.props
    const { pricePrecision, amountPrecision } = this.state

    const processedBids = this.processData(bids, pricePrecision, amountPrecision, 'bids')
    const processedAsks = this.processData(asks, pricePrecision, amountPrecision, 'asks')

    return (
      <DepthChartRenderer
        bids={processedBids}
        asks={processedAsks}
        toolTip={this.toolTip}
        pricePrecision={pricePrecision}
        amountPrecision={amountPrecision}
      />
    )
  }
}

export default DepthChart
