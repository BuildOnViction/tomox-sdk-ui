//@flow
import React from 'react'

import { sortTable } from '../../../utils/helpers'

import OrdersTableRenderer from './OrdersTableRenderer'
import RepayModal from './RepayModal'

type Props = {
  orders: Array<Order>,
  authenticated: Boolean,
  cancelOrder: string => void
};

type State = {
  selectedTabId: string,
  isHideOtherPairs: boolean,
};

class OrdersTable extends React.PureComponent<Props, State> {
  state = {
    selectedTabId: 'open-orders',
    isHideOtherPairs: false,
    isOpenRepay: false,
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
        result[property] = result[property].filter(order => order.pair === pair)
      }

      return result
    }

    return result
  }

  handleSelectTrade = (hash) => {
    this.setState({
      tradeSelected: hash,
    })
  }

  toggleRepayModal = status => {

    this.setState({
      isOpenRepay: status,
    })
  }

  render() {
    const { authenticated, orders, cancelOrder, repayLendingOrder } = this.props
    const { selectedTabId, isHideOtherPairs, tradeSelected, isOpenRepay } = this.state
    const filteredOrders = this.filterOrders()
    const filteredTrades = this.filterTrades()
    const loading = !orders     
        
    return (
      <>
        <OrdersTableRenderer
          loading={loading}
          selectedTabId={selectedTabId}
          onChange={this.changeTab}
          authenticated={authenticated}
          cancelOrder={cancelOrder}
          orders={filteredOrders}
          trades={filteredTrades}
          isHideOtherPairs={isHideOtherPairs}
          handleChangeHideOtherPairs={this.handleChangeHideOtherPairs}
          onSelectTrade={this.handleSelectTrade}
          toggleRepayModal={this.toggleRepayModal}
        />

        <RepayModal
          size="sm"
          title="Repay your borrowing"
          isOpen={isOpenRepay}
          hash={tradeSelected}
          onRepay={repayLendingOrder} />
      </>
    )
  }
}

export default OrdersTable
