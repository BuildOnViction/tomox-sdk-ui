//@flow
import React from 'react'

import { sortTable } from '../../../utils/helpers'

import OrdersTableRenderer from './OrdersTableRenderer'
import RepayModal from './RepayModal'
import TopUpModal from './TopUpModal'

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
    isOpenTopUp: false,
    collateralSelected: this.props.collaterals ? this.props.collaterals[0] : {},
    topUpAmount: '',
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
    const { orders, currentPair: { termSymbol, lendingTokenSymbol }} = this.props
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
        result[property] = result[property].filter(order => (order.termSymbol === termSymbol) && (order.lendingTokenSymbol === lendingTokenSymbol))
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

  handleSelectTrade = (hash: String) => {
    this.setState({
      selectedTrade: hash,
    })
  }

  toggleRepayModal = (status: Boolean) => {
    this.setState({
      isOpenRepay: status,
    })
  }

  handleRepay = () => {
    this.props.repayLendingOrder(this.state.selectedTrade)
    this.toggleRepayModal(false)
  }

  toggleTopUpModal = (status: Boolean) => {
    this.setState({
      isOpenTopUp: status,
    })
  }

  handleSelectCollateral = (collateral) => {
    this.setState({
      collateralSelected: collateral,
    })
  }

  handleChangeTopUpAmount = (e) => {
    this.setState({
      topUpAmount: e.target.value,
    })
  }

  handleTopUp = (hash: String) => {
    const { collateralSelected, topUpAmount } = this.state
    const collateral = {...collateralSelected, amount: topUpAmount}
    this.props.topUpLendingOrder({hash, collateral})
    this.toggleTopUpModal(false)
  }

  render() {
    const { 
      authenticated, 
      orders, 
      cancelLendingOrder,
      collaterals,
    } = this.props

    const { 
      selectedTabId, 
      isHideOtherPairs, 
      selectedTrade,
      isOpenRepay, 
      isOpenTopUp, 
      collateralSelected,
      topUpAmount,
    } = this.state

    const filteredOrders = this.filterOrders()
    const filteredTrades = this.filterTrades()
    const loading = !orders
    const currentTrade = filteredTrades.processing.find(trade => trade.hash === selectedTrade)    
        
    return (
      <>
        <OrdersTableRenderer
          loading={loading}
          selectedTabId={selectedTabId}
          onChange={this.changeTab}
          authenticated={authenticated}
          cancelLendingOrder={cancelLendingOrder}
          orders={filteredOrders}
          trades={filteredTrades}
          isHideOtherPairs={isHideOtherPairs}
          handleChangeHideOtherPairs={this.handleChangeHideOtherPairs}
          onSelectTrade={this.handleSelectTrade}
          toggleRepayModal={this.toggleRepayModal}
          toggleTopUpModal={this.toggleTopUpModal}
        />

        <RepayModal
          size="sm"
          title="Repay your borrowing"
          isOpen={isOpenRepay}
          trade={currentTrade}
          onRepay={this.handleRepay}
          onClose={this.toggleRepayModal}
        />

        <TopUpModal
          size="sm"
          title="Top up collateral to secure your loan"
          isOpen={isOpenTopUp}
          hash={selectedTrade}
          collaterals={collaterals}
          collateralSelected={collateralSelected}
          onSelectCollateral={this.handleSelectCollateral}
          topUpAmount={topUpAmount}
          onChangeAmount={this.handleChangeTopUpAmount}
          onTopUp={this.handleTopUp}
          onClose={this.toggleTopUpModal}
        />
      </>
    )
  }
}

export default OrdersTable
