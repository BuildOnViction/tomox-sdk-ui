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
  isOpen: boolean
};

class OrdersTable extends React.PureComponent<Props, State> {
  static defaultProps = { authenticated: true }
  state = {
    selectedTabId: 'open-orders',
    isOpen: true,
  }

  changeTab = (tabId: string) => {
    this.setState({ selectedTabId: tabId })
  }

  toggleCollapse = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }))
  }

  filterOrders = () => {
    const { orders } = this.props
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

    return result
  }

  render() {
    const { authenticated, orders, cancelOrder } = this.props
    const { selectedTabId, isOpen } = this.state
    const filteredOrders = this.filterOrders()
    const loading = orders.length < 1

    return (
      <OrdersTableRenderer
        isOpen={isOpen}
        loading={loading}
        selectedTabId={selectedTabId}
        onChange={this.changeTab}
        toggleCollapse={this.toggleCollapse}
        authenticated={authenticated}
        cancelOrder={cancelOrder}
        // silence-error: currently too many flow errors, waiting for rest to be resolved
        orders={filteredOrders}
      />
    )
  }
}

export default OrdersTable
