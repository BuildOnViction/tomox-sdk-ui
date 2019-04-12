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
  buyPrice: string,
  sellPrice: string,
  stopPrice: string,
  limitPrice: string,
  buyAmount: string,
  sellAmount: string,
  buyTotal: string,
  sellTotal: string,
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
    buyPrice: '0.0',
    sellPrice: '0.0',
    stopPrice: '0.0',
    limitPrice: '0.0',
    buyAmount: '0.0',
    sellAmount: '0.0',
    buyTotal: '0.0',
    sellTotal: '0.0',
    priceStep: 1/Math.pow(10, pricePrecision),
    amountStep: 1/Math.pow(10, amountPrecision),
  }

  componentDidUpdate(prevProps) {
    const prevSelectedOrder = prevProps.selectedOrder
    const currSelectedOrder = this.props.selectedOrder

    if (!currSelectedOrder) return

    if (prevSelectedOrder 
      && currSelectedOrder.price !== prevSelectedOrder.price) {
      const price = formatNumber(currSelectedOrder.price, { precision: pricePrecision })

      this.setOrderFormPrice(price)
    } else if (!prevSelectedOrder) {
      const price = formatNumber(currSelectedOrder.price, { precision: pricePrecision })

      this.setOrderFormPrice(price)
    }    
  }

  setOrderFormPrice(price) {
    this.setState({ 
      buyPrice: price, 
      sellPrice: price,
      buyAmount: '0.0',
      sellAmount: '0.0',
      buyTotal: '0.0',
      sellTotal: '0.0',
    })
  }

  onInputChange = (side: SIDE = 'BUY', { target }: Object) => {
    const { loggedIn } = this.props
    switch (target.name) {
      case 'stopPrice':
        this.handleStopPriceChange(target.value)
        break
      case 'limitPrice':
        this.handleLimitPriceChange(target.value)
        break
      case 'price':
        this.handlePriceChange(target.value, side)
        break
      case 'total':
        this.handleTotalChange(target.value)
        break
      case 'amount':
        this.handleAmountChange(target.value, side)
        break
      case 'fraction':
        loggedIn && this.handleUpdateAmountFraction(target.value, side)
        break
      default:
        break
    }
  }

  handleSendOrder = (side: SIDE) => {
    const { buyPrice, sellPrice, buyAmount, sellAmount } = this.state

    if (side === 'BUY'){
      this.props.sendNewOrder(side, unformat(buyAmount), unformat(buyPrice))
    } else {
      this.props.sendNewOrder(side, unformat(sellAmount), unformat(sellPrice))
    }                    
  }

  handleUpdateAmountFraction = (fraction: number, side: SIDE) => {
    const { quoteTokenBalance, baseTokenBalance } = this.props

    if (side === 'SELL') {
      const { sellPrice } = this.state
      let sellAmount, sellTotal

      sellAmount = (baseTokenBalance / 100) * fraction
      sellTotal = unformat(sellPrice) * sellAmount

      this.setState({
        fraction,
        sellAmount: formatNumber(sellAmount, { precision: amountPrecision }),
        sellTotal: formatNumber(sellTotal, { precision: pricePrecision }),
      })
    } else {
      const { buyPrice } = this.state
      let buyAmount, buyTotal

      buyTotal = (quoteTokenBalance / 100) * fraction
      buyAmount = buyTotal / unformat(buyPrice)

      this.setState({
        fraction,
        buyAmount: formatNumber(buyAmount, { precision: amountPrecision }),
        buyTotal: formatNumber(buyTotal, { precision: pricePrecision }),
      })
    }
  }

  handlePriceChange = (price: string, side: SIDE) => {
    if (side === 'BUY') {
      let { buyAmount } = this.state

      buyAmount = unformat(buyAmount)
      const buyTotal = buyAmount * unformat(price)

      this.setState({
        buyTotal: formatNumber(buyTotal, { precision: pricePrecision }),
        buyAmount: formatNumber(buyAmount, { precision: amountPrecision }),
        buyPrice: price,
      })
    } else {
      let { sellAmount } = this.state

      sellAmount = unformat(sellAmount)
      const sellTotal = sellAmount * unformat(price)

      this.setState({
        sellTotal: formatNumber(sellTotal, { precision: pricePrecision }),
        sellAmount: formatNumber(sellAmount, { precision: amountPrecision }),
        sellPrice: price,
      })
    }    
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

  handleAmountChange = (amount: string, side: SIDE) => {
    const { selectedTabId } = this.state

    if (side === 'BUY') {
      let { buyPrice, stopPrice } = this.state
      let buyTotal

      stopPrice = unformat(stopPrice)
      buyPrice = unformat(buyPrice)

      selectedTabId === 'stop'
        ? (buyTotal = stopPrice * unformat(amount))
        : (buyTotal = buyPrice * unformat(amount))

      this.setState({
        buyTotal: formatNumber(buyTotal, { precision: pricePrecision }),
        buyPrice: formatNumber(buyPrice, { precision: pricePrecision }),
        buyAmount: amount,
      })
    } else {
      let { sellPrice, stopPrice } = this.state
      let sellTotal

      stopPrice = unformat(stopPrice)
      sellPrice = unformat(sellPrice)

      selectedTabId === 'stop'
        ? (sellTotal = stopPrice * unformat(amount))
        : (sellTotal = sellPrice * unformat(amount))

      this.setState({
        sellTotal: formatNumber(sellTotal, { precision: pricePrecision }),
        sellPrice: formatNumber(sellPrice, { precision: pricePrecision }),
        sellAmount: amount,
      })
    }
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

  handleDecreasePrice = (side: SIDE) => {
    let {buyPrice, sellPrice, buyAmount, sellAmount, priceStep} = this.state

    if (side === 'BUY') {
      buyPrice = unformat(buyPrice) - priceStep
      buyPrice = buyPrice >= 0 ? buyPrice : 0

      const buyTotal = buyPrice * unformat(buyAmount)

      this.setState({
        buyPrice: formatNumber(buyPrice, {precision: pricePrecision}),
        buyTotal: formatNumber(buyTotal, {precision: pricePrecision}),
      })
    } else {
      sellPrice = unformat(sellPrice) - priceStep
      sellPrice = sellPrice >= 0 ? sellPrice : 0

      const sellTotal = sellPrice * unformat(sellAmount)

      this.setState({
        sellPrice: formatNumber(sellPrice, {precision: pricePrecision}),
        sellTotal: formatNumber(sellTotal, {precision: pricePrecision}),
      })
    }
  }

  handleIncreasePrice = (side: SIDE) => {
    let {buyPrice, sellPrice, buyAmount, sellAmount, priceStep} = this.state

    if (side === 'BUY') {
      buyPrice = unformat(buyPrice) + priceStep

      const buyTotal = buyPrice * unformat(buyAmount)

      this.setState({
        buyPrice: formatNumber(buyPrice, {precision: pricePrecision}),
        buyTotal: formatNumber(buyTotal, {precision: pricePrecision}),
      })
    } else {
      sellPrice = unformat(sellPrice) + priceStep

      const sellTotal = sellPrice * unformat(sellAmount)

      this.setState({
        sellPrice: formatNumber(sellPrice, {precision: pricePrecision}),
        sellTotal: formatNumber(sellTotal, {precision: pricePrecision}),
      })
    }
  }

  handleDecreaseAmount = (side: SIDE) => {
    let {buyAmount, sellAmount, buyPrice, sellPrice, amountStep} = this.state

    if (side === 'BUY') {
      buyAmount = unformat(buyAmount) - amountStep
      buyAmount = buyAmount >= 0 ? buyAmount : 0

      const buyTotal = buyAmount * unformat(buyPrice)

      this.setState({
        buyAmount: formatNumber(buyAmount, {precision: amountPrecision}),
        buyTotal: formatNumber(buyTotal, {precision: pricePrecision}),
      })
    } else {
      sellAmount = unformat(sellAmount) - amountStep
      sellAmount = sellAmount >= 0 ? sellAmount : 0

      const sellTotal = sellAmount * unformat(sellPrice)
      
      this.setState({
        sellAmount: formatNumber(sellAmount, {precision: amountPrecision}),
        sellTotal: formatNumber(sellTotal, {precision: pricePrecision}),
      })
    }
  }

  handleIncreaseAmount = (side: SIDE) => {
    let {buyAmount, sellAmount, buyPrice, sellPrice, amountStep} = this.state

    if (side === 'BUY') {
      buyAmount = unformat(buyAmount) + amountStep
      buyAmount = buyAmount >= 0 ? buyAmount : 0

      const buyTotal = buyAmount * unformat(buyPrice)

      this.setState({
        buyAmount: formatNumber(buyAmount, {precision: amountPrecision}),
        buyTotal: formatNumber(buyTotal, {precision: pricePrecision}),
      })
    } else {
      sellAmount = unformat(sellAmount) + amountStep
      sellAmount = sellAmount >= 0 ? sellAmount : 0

      const sellTotal = sellAmount * unformat(sellPrice)

      this.setState({
        sellAmount: formatNumber(sellAmount, {precision: amountPrecision}),
        sellTotal: formatNumber(sellTotal, {precision: pricePrecision}),
      })
    }
  }

  render() {
    const {
      state: {
        side,
        selectedTabId,
        fraction,
        priceType,
        buyPrice,
        sellPrice,
        isOpen,
        stopPrice,
        limitPrice,
        buyAmount,
        sellAmount,
        buyTotal,
        sellTotal,
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
      handleDecreasePrice,
      handleIncreasePrice,
      handleDecreaseAmount,
      handleIncreaseAmount,
    } = this

    let buyMaxAmount, sellMaxAmount
    const formattedMakeFee = makeFee && utils.formatUnits(makeFee, quoteTokenDecimals)
    const maxQuoteTokenAmount = quoteTokenBalance - Number(formattedMakeFee)

    // if (buyPrice !== '0.0000000' || sellPrice !== '0.0000000') {
    //   if (side === 'BUY') {
    //     buyMaxAmount = formatNumber(maxQuoteTokenAmount / unformat(buyPrice), { decimals: 3 })
    //   } else {
    //     sellMaxAmount = formatNumber(baseTokenBalance, { decimals: 3 })
    //   }
    // } else {
    //   buyMaxAmount = '0.0'
    //   sellMaxAmount = '0.0'
    // }

    if (buyPrice !== '0.0') {
      buyMaxAmount = formatNumber(maxQuoteTokenAmount / unformat(buyPrice), { decimals: 3 })
    } else {
      buyMaxAmount = '0.0'
    }

    if (sellPrice !== '0.0') {
      sellMaxAmount = formatNumber(baseTokenBalance, { decimals: 3 })
    } else {
      sellMaxAmount = '0.0'
    }

    const insufficientBalanceToBuy = (unformat(buyAmount) > unformat(buyMaxAmount))
    const insufficientBalanceToSell = (unformat(sellAmount) > unformat(sellMaxAmount))

    return (
      <OrderFormRenderer
        selectedTabId={selectedTabId}
        side={side}
        fraction={fraction}
        priceType={priceType}
        buyPrice={buyPrice}
        sellPrice={sellPrice}
        stopPrice={stopPrice}
        limitPrice={limitPrice}
        buyAmount={buyAmount}
        sellAmount={sellAmount}
        buyMaxAmount={buyMaxAmount}
        sellMaxAmount={sellMaxAmount}
        buyTotal={buyTotal}
        sellTotal={sellTotal}
        isOpen={isOpen}
        makeFee={makeFee}
        takeFee={takeFee}
        baseTokenSymbol={baseTokenSymbol}
        quoteTokenSymbol={quoteTokenSymbol}
        baseTokenDecimals={baseTokenDecimals}
        quoteTokenDecimals={quoteTokenDecimals}
        loggedIn={loggedIn}
        insufficientBalanceToBuy={insufficientBalanceToBuy}
        insufficientBalanceToSell={insufficientBalanceToSell}
        pairIsAllowed={pairIsAllowed}
        pairAllowanceIsPending={pairAllowanceIsPending}
        onInputChange={onInputChange}
        handleUnlockPair={handleUnlockPair}
        toggleCollapse={toggleCollapse}
        handleChangeOrderType={handleChangeOrderType}
        handleSendOrder={handleSendOrder}
        handleSideChange={handleSideChange}
        handleDecreasePrice={handleDecreasePrice}
        handleIncreasePrice={handleIncreasePrice}
        handleDecreaseAmount={handleDecreaseAmount}
        handleIncreaseAmount={handleIncreaseAmount}
      />
    )
  }
}

export default OrderForm
