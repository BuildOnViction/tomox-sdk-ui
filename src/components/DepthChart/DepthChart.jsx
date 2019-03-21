// @flow
import React from 'react'
import DepthChartRenderer from './DepthChartRenderer'

var AmCharts = require('@amcharts/amcharts3-react');

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
  
  formatNumber = (val: string, chart: Object, precision: number) => {
    return AmCharts.formatNumber(val, {
      precision: precision ? precision : chart.precision,
      decimalSeparator: chart.decimalSeparator,
      thousandsSeparator: chart.thousandsSeparator,
    })
  }

  toolTip = (item: Object, graph: Object) => {
    let txt
    if (graph.id === 'asks') {
      txt = `Ask: <strong>${this.formatNumber(
        item.dataContext.price,
        graph.chart,
        4
      )}</strong><br />
      Total volume: <strong>${this.formatNumber(
        item.dataContext.total,
        graph.chart,
        4
      )}</strong><br />
      Volume: <strong>${this.formatNumber(
        item.dataContext.amount,
        graph.chart,
        4
      )}</strong>`
    } else {
      txt = `Bid: <strong>${this.formatNumber(
        item.dataContext.price,
        graph.chart,
        4
      )}</strong><br />
      Total volume: <strong>${this.formatNumber(
        item.dataContext.total,
        graph.chart,
        4
      )}</strong><br />
      Volume: <strong>${this.formatNumber(
        item.dataContext.amount,
        graph.chart,
        4
      )}</strong>`
    }
    return txt
  };

  render() {
    const { bids, asks } = this.props

    return (
      <DepthChartRenderer
        bids={bids}
        asks={asks}
        toolTip={this.toolTip}
      />
    )
  }
}

export default DepthChart
