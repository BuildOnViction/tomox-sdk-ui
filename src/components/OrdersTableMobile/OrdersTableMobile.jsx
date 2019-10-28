//@flow
import React from 'react'
import OrdersTableRendererMobile from './OrdersTableRendererMobile'
import { sortTable } from '../../utils/helpers'

import type { Order } from '../../types/orders'

type Props = {
  orders: Array<Order>,
  authenticated: false,
  cancelOrder: string => void
};

type State = {
  selectedTabId: string,
  isHideOtherPairs: boolean,
};

class OrdersTableMobile extends React.PureComponent<Props, State> {
  static defaultProps = { authenticated: true }
  state = {
    selectedTabId: 'open-orders',
    isHideOtherPairs: false,
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
    const { trades, currentPair: { pair }} = this.props
    const { isHideOtherPairs } = this.state
    let result = trades

    if (isHideOtherPairs) {
      result = result.filter(trade => trade.pair === pair)
      return result
    }

    return result
  }

  render() {
    const { authenticated, orders, cancelOrder } = this.props
    const { selectedTabId, isHideOtherPairs } = this.state
    const filteredOrders = this.filterOrders()
    const filteredTrades = this.filterTrades()
    const loading = !orders

    return (
      <OrdersTableRendererMobile
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
      />
    )
  }
}

export default OrdersTableMobile
