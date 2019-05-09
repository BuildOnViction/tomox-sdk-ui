//@flow
import React from 'react'
import OrdersTableRenderer from './OrdersTableRenderer'
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

class OrdersTable extends React.PureComponent<Props, State> {
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
    const result = { ALL: orders }
    const filters = [
      'OPEN',
      'CANCELLED',
      'PENDING',
      'EXECUTED',
      'PARTIALLY_FILLED',
    ]

    for (const filter of filters) {
      // silence-error: currently too many flow errors, waiting for rest to be resolved
      result[filter] = orders.filter(order => {
        return order.status === filter
      })
    }

    for (const filter of filters.concat('ALL')) {
      // silence-error: currently too many flow errors, waiting for rest to be resolved
      result[filter] = sortTable(result[filter], 'time', (a, b) => {
        // sort by DESC
        return a < b ? 1 : -1
      })
    }

    if (isHideOtherPairs) {
      result['OPEN'] = result['OPEN'].filter(trade => trade.pair === pair)
      result['ALL'] = result['ALL'].filter(trade => trade.pair === pair)

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
      <OrdersTableRenderer
        loading={loading}
        selectedTabId={selectedTabId}
        onChange={this.changeTab}
        toggleCollapse={this.toggleCollapse}
        authenticated={authenticated}
        cancelOrder={cancelOrder}
        // silence-error: currently too many flow errors, waiting for rest to be resolved
        orders={filteredOrders}
        trades={filteredTrades}
        isHideOtherPairs={isHideOtherPairs}
        handleChangeHideOtherPairs={this.handleChangeHideOtherPairs}
      />
    )
  }
}

export default OrdersTable
