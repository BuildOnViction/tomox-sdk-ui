//@flow
import React from 'react'
import { differenceInSeconds } from 'date-fns'
import { FormattedMessage } from 'react-intl'

import { sortTable } from '../../../utils/helpers'

import OrdersTableRenderer from './OrdersTableRenderer'
import RepayModal from './RepayModal'
import TopUpModal from './TopUpModal'
import BigNumber from 'bignumber.js'
import { lendingAmountPrecision } from '../../../config/tokens'

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
    selectedCollateral: {},
    selectedTrade: {},
    topUpAmount: '',
    errorTopUp: null,
    errorRepay: false,
    realInterest: '',
    lendingToken: '',
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

  handleSelectTrade = (trade: Object) => {
    this.setState({
      selectedTrade: trade,
    })
  }

  toggleRepayModal = (status: Boolean) => {
    const { selectedTrade } = this.state
    if (!selectedTrade) return
    
    if (status && selectedTrade && selectedTrade.isBorrower) {
      const lendingToken = this.props.lendingTokens.find(token => token.address.toLowerCase() === selectedTrade.lendingToken.toLowerCase())
      const realTimesInSeconds = differenceInSeconds(new Date(), new Date(selectedTrade.time))
      const realInterest = (Number(selectedTrade.amount) * Number(selectedTrade.interest) * (realTimesInSeconds + Number(selectedTrade.term)))/(100*2*365*24*60*60)    
      const totalRepay = realInterest + Number(selectedTrade.amount)
      
      return this.setState({
        lendingToken,
        realInterest,
        totalRepay,
        isOpenRepay: status,
      })
    }

    this.setState({
      lendingToken: '',
      realInterest: '',
      totalRepay: '',
      errorRepay: false,
      isOpenRepay: status,
    })
  }

  handleRepay = () => {
    const { totalRepay, lendingToken } = this.state

    if (BigNumber(totalRepay.toFixed(lendingAmountPrecision)).gt(Number(lendingToken.availableBalance).toFixed(lendingAmountPrecision))) {
      return this.setState({ errorRepay: true })
    }

    this.props.repayLendingOrder(this.state.selectedTrade.hash)
    this.toggleRepayModal(false)
  }

  toggleTopUpModal = (status: Boolean) => {
    if (status) {
      const { collaterals } = this.props
      const { selectedTrade } = this.state
      const selectedCollateral = collaterals.find(collateral => collateral.address.toLowerCase() === selectedTrade.collateralToken.toLowerCase())
      
      return this.setState({
        selectedCollateral,
        isOpenTopUp: status,
        topUpAmount: '',
        errorTopUp: null,
      })
    }

    this.setState({
      selectedCollateral: {},
      isOpenTopUp: status,
      topUpAmount: '',
      errorTopUp: null,
    })
  }

  handleChangeTopUpAmount = (e) => {
    this.setState({
      topUpAmount: e.target.value,
      errorTopUp: false,
    })
  }

  selectAllAvailableBalance = _ => {
    const { selectedCollateral } = this.state

    this.setState({
      topUpAmount: selectedCollateral ? selectedCollateral.availableBalance : 0,
      errorTopUp: null,
    })
  }

  handleTopUp = (hash: String) => {
    const { selectedCollateral, topUpAmount } = this.state

    if (!topUpAmount) return this.setState({errorTopUp: {message: 'Please enter amount'}})
    if (BigNumber(selectedCollateral.availableBalance).lt(topUpAmount)) return this.setState({errorTopUp: {message: 'Balance not enough'}})

    const collateral = {...selectedCollateral, amount: topUpAmount}
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
      selectedCollateral,
      topUpAmount,
      errorTopUp,
      errorRepay,
      realInterest,
      totalRepay,
      lendingToken,
    } = this.state
    
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
          title={<FormattedMessage id="exchangeLendingPage.orders.repayModal.title" />}
          isOpen={isOpenRepay}
          trade={selectedTrade}
          realInterest={realInterest}
          totalRepay={totalRepay}
          lendingToken={lendingToken}
          onRepay={this.handleRepay}
          onClose={this.toggleRepayModal}
          errorRepay={errorRepay}
        />

        <TopUpModal
          size="sm"
          title={<FormattedMessage id="exchangeLendingPage.orders.topUpModal.title" />}
          isOpen={isOpenTopUp}
          hash={selectedTrade.hash}
          collaterals={collaterals}
          selectedCollateral={selectedCollateral}
          topUpAmount={topUpAmount}
          onChangeAmount={this.handleChangeTopUpAmount}
          onTopUp={this.handleTopUp}
          onClose={this.toggleTopUpModal}
          error={errorTopUp}
          selectAllAvailableBalance={this.selectAllAvailableBalance}
        />
      </>
    )
  }
}

export default OrdersTable
