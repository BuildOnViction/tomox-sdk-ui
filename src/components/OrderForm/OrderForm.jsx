// @flow
import React from 'react'
import { utils } from 'ethers'
import { formatNumber, unformat } from 'accounting-js'

import type { SIDE } from '../../types/orderForm'

import OrderFormRenderer from './OrderFormRenderer'
import { pricePrecision, amountPrecision } from '../../config/tokens'

type Props = {
  side: SIDE,
  askPrice: number,
  bidPrice: number,
  baseTokenBalance: number,
  quoteTokenBalance: number,
  baseTokenSymbol: string,
  quoteTokenSymbol: string,
  baseTokenDecimals: number,
  quoteTokenDecimals: number,
  makeFee: string,
  takeFee: string,
  loggedIn: boolean,
  pairIsAllowed: boolean,
  pairAllowanceIsPending: boolean,
  unlockPair: (string, string) => void,
  sendNewOrder: (string, number, number) => void,
}

type State = {
  side: SIDE,
  fraction: number,
  priceType: string,
  selectedTabId: string,
  price: string,
  stopPrice: string,
  limitPrice: string,
  amount: string,
  total: string,
  isOpen: boolean,
}

class OrderForm extends React.PureComponent<Props, State> {
  static defaultProps = {
    loggedIn: true,
    bidPrice: 0,
    askPrice: 0,
    baseTokenBalance: 0,
    quoteTokenBalance: 0,
  }

  state = {
    side: 'BUY',
    fraction: 0,
    isOpen: true,
    priceType: 'null',
    selectedTabId: 'limit',
    price: '0.0',
    stopPrice: '0.0',
    limitPrice: '0.0',
    amount: '0.0',
    total: '0.0',
  }

  componentDidMount() {
    const { side, askPrice, bidPrice } = this.props

    side === 'BUY'
      ? this.setState({ price: formatNumber(askPrice, { precision: pricePrecision }) })
      : this.setState({ price: formatNumber(bidPrice, { precision: pricePrecision }) })
  }

  onInputChange = ({ target }: Object) => {
    const { loggedIn } = this.props
    switch (target.name) {
      case 'stopPrice':
        this.handleStopPriceChange(target.value)
        break
      case 'limitPrice':
        this.handleLimitPriceChange(target.value)
        break
      case 'price':
        this.handlePriceChange(target.value)
        break
      case 'total':
        this.handleTotalChange(target.value)
        break
      case 'amount':
        this.handleAmountChange(target.value)
        break
      case 'fraction':
        loggedIn && this.handleUpdateAmountFraction(target.value)
        break
      default:
        break
    }
  }

  handleSendOrder = () => {
    let { amount, price } = this.state
    const { side } = this.state

    amount = unformat(amount)
    price = unformat(price)

    this.props.sendNewOrder(side, amount, price)
  }

  handleUpdateAmountFraction = (fraction: number) => {
    const { price } = this.state
    const { side, quoteTokenBalance, baseTokenBalance } = this.props
    let amount, total

    if (side === 'SELL') {
      amount = (baseTokenBalance / 100) * fraction
      total = unformat(price) * amount

      this.setState({
        fraction,
        amount: formatNumber(amount, { precision: amountPrecision }),
        total: formatNumber(total, { precision: pricePrecision }),
      })
    } else {
      total = (quoteTokenBalance / 100) * fraction
      amount = total / unformat(price)

      this.setState({
        fraction,
        amount: formatNumber(amount, { precision: amountPrecision }),
        total: formatNumber(total, { precision: pricePrecision }),
      })
    }
  }

  handleSideChange = (side: SIDE) => {
    this.setState({ side })
  }

  handlePriceChange = (price: string) => {
    let { amount } = this.state

    amount = unformat(amount)
    const total = amount * unformat(price)

    this.setState({
      total: formatNumber(total, { precision: pricePrecision }),
      amount: formatNumber(amount, { precision: amountPrecision }),
      price,
    })
  }

  handleLimitPriceChange = (limitPrice: string) => {
    let { amount, stopPrice } = this.state

    amount = unformat(amount)
    stopPrice = unformat(stopPrice)

    this.setState({
      amount: formatNumber(amount, { precision: amountPrecision }),
      stopPrice: formatNumber(stopPrice, { precision: pricePrecision }),
      limitPrice,
    })
  }

  handleStopPriceChange = (stopPrice: string) => {
    let { amount } = this.state

    amount = unformat(amount)
    const total = amount * unformat(stopPrice)

    this.setState({
      total: formatNumber(total, { precision: pricePrecision }),
      amount: formatNumber(amount, { precision: amountPrecision }),
      stopPrice,
    })
  }

  handleAmountChange = (amount: string) => {
    const { selectedTabId } = this.state
    let { price, stopPrice } = this.state
    let total

    stopPrice = unformat(stopPrice)
    price = unformat(price)

    selectedTabId === 'stop'
      ? (total = stopPrice * unformat(amount))
      : (total = price * unformat(amount))

    this.setState({
      total: formatNumber(total, { precision: pricePrecision }),
      price: formatNumber(price, { precision: pricePrecision }),
      amount,
    })
  }

  handleTotalChange = (total: string) => {
    const { selectedTabId } = this.state
    let { price, stopPrice } = this.state
    let amount

    price = unformat(price)
    stopPrice = unformat(stopPrice)

    if (selectedTabId === 'stop') {
      if (stopPrice === 0) {
        amount = 0
      } else {
        amount = unformat(total) / stopPrice
      }
    } else if (price === 0) {
      amount = 0
    } else {
      amount = unformat(total) / price
    }

    this.setState({
      price: formatNumber(price, { precision: pricePrecision }),
      stopPrice: formatNumber(stopPrice, { precision: pricePrecision }),
      amount: formatNumber(amount, { precision: amountPrecision }),
      total,
    })
  }

  handleUnlockPair = () => {
    const { baseTokenSymbol, quoteTokenSymbol } = this.props

    this.props.unlockPair(baseTokenSymbol, quoteTokenSymbol)
  }

  handleChangeOrderType = (tabId: string) => {
    const { askPrice, bidPrice, side } = this.props

    this.setState({
      selectedTabId: tabId,
      fraction: 0,
      priceType: 'null',
      price: '',
      stopPrice: '',
      limitPrice: '',
      amount: '',
      total: '',
    })

    if (tabId === 'limit' && side === 'BUY') {
      this.setState({ price: formatNumber(askPrice, { precision: pricePrecision }) })
    } else if (tabId === 'limit') {
      this.setState({ price: formatNumber(bidPrice, { precision: pricePrecision }) })
    } else if (tabId === 'market' && side === 'BUY') {
      this.setState({ price: formatNumber(askPrice, { precision: pricePrecision }) })
    } else if (tabId === 'market') {
      this.setState({ price: formatNumber(bidPrice, { precision: pricePrecision }) })
    }
  }

  toggleCollapse = () => {
    this.setState(prevState => ({ isOpen: !prevState.isOpen }))
  }

  render() {
    const {
      state: {
        side,
        selectedTabId,
        fraction,
        priceType,
        price,
        isOpen,
        stopPrice,
        limitPrice,
        amount,
        total,
      },
      props: {
        baseTokenSymbol,
        quoteTokenSymbol,
        baseTokenDecimals,
        quoteTokenDecimals,
        loggedIn,
        pairIsAllowed,
        pairAllowanceIsPending,
        makeFee,
        takeFee,
        baseTokenBalance,
        quoteTokenBalance,
      },
      onInputChange,
      handleChangeOrderType,
      handleUnlockPair,
      toggleCollapse,
      handleSendOrder,
      handleSideChange,
    } = this

    let maxAmount
    const formattedMakeFee = makeFee && utils.formatUnits(makeFee, quoteTokenDecimals)
    const maxQuoteTokenAmount = quoteTokenBalance - Number(formattedMakeFee)

    if (price !== '0.000') {
      if (side === 'BUY') {
        maxAmount = formatNumber(maxQuoteTokenAmount / unformat(price), { decimals: 3 })
      } else {
        maxAmount = formatNumber(baseTokenBalance, { decimals: 3 })
      }
    } else {
      maxAmount = '0.0'
    }

    const insufficientBalance = (unformat(amount) > unformat(maxAmount))

    return (
      <OrderFormRenderer
        selectedTabId={selectedTabId}
        side={side}
        fraction={fraction}
        priceType={priceType}
        price={price}
        stopPrice={stopPrice}
        limitPrice={limitPrice}
        amount={amount}
        maxAmount={maxAmount}
        total={total}
        isOpen={isOpen}
        makeFee={makeFee}
        takeFee={takeFee}
        baseTokenSymbol={baseTokenSymbol}
        quoteTokenSymbol={quoteTokenSymbol}
        baseTokenDecimals={baseTokenDecimals}
        quoteTokenDecimals={quoteTokenDecimals}
        loggedIn={loggedIn}
        insufficientBalance={insufficientBalance}
        pairIsAllowed={pairIsAllowed}
        pairAllowanceIsPending={pairAllowanceIsPending}
        onInputChange={onInputChange}
        handleUnlockPair={handleUnlockPair}
        toggleCollapse={toggleCollapse}
        handleChangeOrderType={handleChangeOrderType}
        handleSendOrder={handleSendOrder}
        handleSideChange={handleSideChange}
      />
    )
  }
}

export default OrderForm
