//@flow
import React from 'react'
import DappLendingOrdersTableRenderer from './DappLendingOrdersTableRenderer'
import { sortTable } from '../../../utils/helpers'

import type { Order } from '../../../types/orders'

type Props = {
  orders: Array<Order>,
  authenticated: false,
  cancelOrder: string => void
};

type State = {
  selectedTabId: string,
  isHideOtherPairs: boolean,
};

class DappLendingOrdersTable extends React.PureComponent<Props, State> {
  static defaultProps = { authenticated: true }
  state = {
    selectedPanel: 'orders',
    selectedTabId: 'open-orders',
    isHideOtherPairs: false,
    pricePrecision: 4,
    amountPrecision: 4,
  }

  componentDidUpdate(prevProps) {
    if (this.props.currentPairData && (
      this.props.currentPairData.pricePrecision !== this.state.pricePrecision
      || this.props.currentPairData.amountPrecision !== this.state.amountPrecision)) {
      this.setState({
        pricePrecision: this.props.currentPairData.pricePrecision,
        amountPrecision: this.props.currentPairData.amountPrecision,
      })
    }
  }

  handleChangePanel = (panelId: string) => {
    this.setState({ selectedPanel: panelId })
  }

  changeTab = (tabId: string) => {
    this.setState({ selectedTabId: tabId })
  }

  handleChangeHideOtherPairs = () => {
    this.setState({
      isHideOtherPairs: !this.state.isHideOtherPairs,
    })
  }

  filterOrders = () => {
    const { orders, currentPair: { pair }} = this.props
    const { isHideOtherPairs } = this.state
    const result = {}

    result['finished'] = orders.filter(order => {
      return (order.status === 'FILLED' || order.status === 'CANCELLED'|| order.status === 'REJECTED')
    })

    result['processing'] = orders.filter(order => {
      return (order.status !== 'FILLED' && order.status !== 'CANCELLED' && order.status !== 'REJECTED')
    })

    for (const property in result) {
      result[property] = sortTable(result[property], 'time', (a, b) => {
        // sort by DESC
        return a < b ? 1 : -1
      })
    }

    if (isHideOtherPairs) {
      for (const property in result) {
        result[property] = result[property].filter(order => order.pair === pair)
      }

      return result
    }

    return result
  }

  filterTrades = () => {
    const { trades, currentPair: { termSymbol, lendingTokenSymbol }} = this.props
    const { isHideOtherPairs } = this.state
    const result = {}

    result['finished'] = trades.filter(trade => {
      return (trade.status !== 'OPEN')
    })

    result['processing'] = trades.filter(trade => {
      return (trade.status === 'OPEN')
    })

    for (const property in result) {
      result[property] = sortTable(result[property], 'time', (a, b) => {
        // sort by DESC
        return a < b ? 1 : -1
      })
    }

    if (isHideOtherPairs) {
      for (const property in result) {
        result[property] = result[property].filter(order => (order.termSymbol === termSymbol) && (order.lendingTokenSymbol === lendingTokenSymbol))
      }

      return result
    }

    return result
  }

  render() {
    const { authenticated, orders, cancelOrder } = this.props
    const { selectedPanel, selectedTabId, isHideOtherPairs, pricePrecision, amountPrecision } = this.state
    const filteredOrders = this.filterOrders()
    const filteredTrades = this.filterTrades()
    const loading = !orders

    return (
      <DappLendingOrdersTableRenderer
        loading={loading}
        selectedTabId={selectedTabId}
        onChange={this.changeTab}
        toggleCollapse={this.toggleCollapse}
        authenticated={authenticated}
        cancelOrder={cancelOrder}
        orders={filteredOrders}
        trades={filteredTrades}
        isHideOtherPairs={isHideOtherPairs}
        handleChangeHideOtherPairs={this.handleChangeHideOtherPairs}
        pricePrecision={pricePrecision} 
        amountPrecision={amountPrecision}
        selectedPanel={selectedPanel}
        handleChangePanel={this.handleChangePanel}
      />
    )
  }
}

export default DappLendingOrdersTable
