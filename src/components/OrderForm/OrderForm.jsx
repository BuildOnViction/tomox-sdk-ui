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
    buyPrice: '',
    sellPrice: '',
    stopPrice: '',
    limitPrice: '',
    buyAmount: '',
    sellAmount: '',
    buyTotal: '',
    sellTotal: '',
    priceStep: 1/Math.pow(10, pricePrecision),
    amountStep: 1/Math.pow(10, amountPrecision),
    errorBuy: null,
    errorSell: null,
    isShowBuyMaxAmount: false,
    isShowSellMaxAmount: false,
  }

  buyPriceInput = React.createRef()
  sellPriceInput = React.createRef()
  buyAmountInput = React.createRef()
  sellAmountInput = React.createRef()

  componentDidUpdate(prevProps) {
    const prevSelectedOrder = prevProps.selectedOrder
    const currSelectedOrder = this.props.selectedOrder
    const { currentPairData } = this.props
    const { buyPrice, sellPrice } = this.state

    if (!currSelectedOrder 
      && !buyPrice 
      && !sellPrice 
      && currentPairData) {
      const price = formatNumber(currentPairData.last_trade_price, { precision: pricePrecision })

      this.setOrderFormPrice(price)
      return
    }

    if(!prevSelectedOrder && currSelectedOrder) {
      this.resetErrorObject()

      const price = formatNumber(currSelectedOrder.price, { precision: pricePrecision })
      this.setOrderFormPrice(price)
      return
    }

    if (prevSelectedOrder && prevSelectedOrder.price !== currSelectedOrder.price) {
      this.resetErrorObject()

      const price = formatNumber(currSelectedOrder.price, { precision: pricePrecision })
      this.setOrderFormPrice(price)
      return
    }  
  }

  setOrderFormPrice(price) {
    this.setState({ 
      buyPrice: price, 
      sellPrice: price,
      buyAmount: '',
      sellAmount: '',
      buyTotal: '',
      sellTotal: '',
    })
  }

  onInputChange = (side: SIDE = 'BUY', { target }: Object) => {
    const { loggedIn } = this.props
    let { value } = target

    value = value.replace(/[^0-9.]/g, '').replace(/^0+/g, '0')    
    value = value.match(/^0[1-9]/g) ? value.replace(/^0/, '') : value
    value = value.match(/^\.[1-9]/g) ? value.replace(/^./, '0.') : value
    value = value.match(/^[0-9]*\.[0-9]*\.$/g) ? value.replace(/.$/, '') : value
    
    switch (target.name) {
      case 'stopPrice':
        this.handleStopPriceChange(value)
        break
      case 'limitPrice':
        this.handleLimitPriceChange(value)
        break
      case 'price':
        this.handlePriceChange(value, side)
        break
      case 'total':
        this.handleTotalChange(value)
        break
      case 'amount':
        this.handleAmountChange(value, side)
        break
      case 'fraction':
        loggedIn && this.handleUpdateAmountFraction(value, side)
        break
      default:
        break
    }
  }

  handleSendOrder = (side: SIDE) => {
    const error = this.isInvalidInput(side)
    if (error) {
      (side === 'BUY') ? this.setState({ errorBuy: error }) : this.setState({ errorSell: error })
      return
    }

    const { buyPrice, sellPrice, buyAmount, sellAmount } = this.state

    if (side === 'BUY'){
      this.props.sendNewOrder(side, unformat(buyAmount), unformat(buyPrice))
    } else {
      this.props.sendNewOrder(side, unformat(sellAmount), unformat(sellPrice))
    }                    
  }

  handleUpdateAmountFraction = (fraction: number, side: SIDE) => {
    const { quoteTokenBalance, baseTokenBalance, authenticated } = this.props

    if (!authenticated) return

    if (side === 'SELL') {
      const { sellPrice } = this.state
      let sellAmount, sellTotal

      sellAmount = (baseTokenBalance / 100) * fraction
      sellTotal = sellPrice ? unformat(sellPrice) * sellAmount : ''

      this.setState({
        fraction,
        sellAmount: formatNumber(sellAmount, { precision: amountPrecision }),
        sellTotal: sellTotal ? formatNumber(sellTotal, { precision: pricePrecision }) : '',
      })
    } else {
      const { buyPrice } = this.state
      let buyAmount, buyTotal

      buyTotal = (quoteTokenBalance / 100) * fraction
      buyAmount = unformat(buyPrice) ? buyTotal / unformat(buyPrice) : ''


      this.setState({
        fraction,
        buyAmount: buyAmount ? formatNumber(buyAmount, { precision: amountPrecision }) : '',
        buyTotal: formatNumber(buyTotal, { precision: pricePrecision }),
      })
    }
  }

  handlePriceChange = (price: string, side: SIDE) => {
    this.resetErrorObject(side)

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
    this.resetErrorObject(side)
    const { selectedTabId, amountStep } = this.state
    const amountStepString = formatNumber(amountStep, { precision: amountPrecision })

    if (side === 'BUY') {
      if (amount.length >= amountStepString.length 
      && Number(amount) < Number(amountStep)) {
        this.setState({ buyAmount: formatNumber(0, { precision: amountPrecision }) })
        return
      }

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
        isShowBuyMaxAmount: true,
      })
    } else {
      if (amount.length >= amountStepString.length 
      && Number(amount) < Number(amountStep)) {
        this.setState({ sellAmount: formatNumber(0, { precision: amountPrecision }) })
        return
      }

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
        isShowSellMaxAmount: true,
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

  handleDecreasePrice = (event, side: SIDE) => {
    event.preventDefault()

    let {
      state: {
        buyPrice, 
        sellPrice, 
        buyAmount, 
        sellAmount, 
        priceStep
      },
      buyPriceInput,
      sellPriceInput,
    } = this

    if (side === 'BUY') {
      buyPriceInput.current.focus()

      buyPrice = unformat(buyPrice) - priceStep
      buyPrice = buyPrice >= 0 ? buyPrice : 0

      const buyTotal = buyPrice * unformat(buyAmount)

      this.setState({
        buyPrice: formatNumber(buyPrice, {precision: pricePrecision}),
        buyTotal: formatNumber(buyTotal, {precision: pricePrecision}),
      })
    } else {
      sellPriceInput.current.focus()

      sellPrice = unformat(sellPrice) - priceStep
      sellPrice = sellPrice >= 0 ? sellPrice : 0

      const sellTotal = sellPrice * unformat(sellAmount)

      this.setState({
        sellPrice: formatNumber(sellPrice, {precision: pricePrecision}),
        sellTotal: formatNumber(sellTotal, {precision: pricePrecision}),
      })
    }
  }

  handleIncreasePrice = (event, side: SIDE) => {
    event.preventDefault()

    let {
      state: {
        buyPrice, 
        sellPrice, 
        buyAmount, 
        sellAmount, 
        priceStep
      },
      buyPriceInput,
      sellPriceInput,
    } = this

    if (side === 'BUY') {
      buyPriceInput.current.focus()

      buyPrice = unformat(buyPrice) + priceStep
      const buyTotal = buyPrice * unformat(buyAmount)

      this.setState({
        buyPrice: formatNumber(buyPrice, {precision: pricePrecision}),
        buyTotal: formatNumber(buyTotal, {precision: pricePrecision}),
      })
    } else {
      sellPriceInput.current.focus()

      sellPrice = unformat(sellPrice) + priceStep
      const sellTotal = sellPrice * unformat(sellAmount)

      this.setState({
        sellPrice: formatNumber(sellPrice, {precision: pricePrecision}),
        sellTotal: formatNumber(sellTotal, {precision: pricePrecision}),
      })
    }
  }

  handleDecreaseAmount = (event, side: SIDE) => {
    event.preventDefault()

    let {
      state: {
        buyAmount, 
        sellAmount, 
        buyPrice, 
        sellPrice, 
        amountStep
      },
      buyAmountInput,
      sellAmountInput,
    } = this

    if (side === 'BUY') {
      buyAmountInput.current.focus()

      buyAmount = unformat(buyAmount) - amountStep
      buyAmount = buyAmount >= 0 ? buyAmount : 0

      const buyTotal = buyAmount * unformat(buyPrice)

      this.setState({
        buyAmount: formatNumber(buyAmount, {precision: amountPrecision}),
        buyTotal: formatNumber(buyTotal, {precision: pricePrecision}),
      })
    } else {
      sellAmountInput.current.focus()

      sellAmount = unformat(sellAmount) - amountStep
      sellAmount = sellAmount >= 0 ? sellAmount : 0

      const sellTotal = sellAmount * unformat(sellPrice)
      
      this.setState({
        sellAmount: formatNumber(sellAmount, {precision: amountPrecision}),
        sellTotal: formatNumber(sellTotal, {precision: pricePrecision}),
      })
    }
  }

  handleIncreaseAmount = (event, side: SIDE) => {
    event.preventDefault()

    let {
      state: {
        buyAmount, 
        sellAmount, 
        buyPrice, 
        sellPrice, 
        amountStep
      }, 
      buyAmountInput, 
      sellAmountInput,
    } = this

    if (side === 'BUY') {
      buyAmountInput.current.focus()

      buyAmount = unformat(buyAmount) + amountStep
      buyAmount = buyAmount >= 0 ? buyAmount : 0

      const buyTotal = buyAmount * unformat(buyPrice)

      this.setState({
        buyAmount: formatNumber(buyAmount, {precision: amountPrecision}),
        buyTotal: formatNumber(buyTotal, {precision: pricePrecision}),
      })
    } else {
      sellAmountInput.current.focus()

      sellAmount = unformat(sellAmount) + amountStep
      sellAmount = sellAmount >= 0 ? sellAmount : 0

      const sellTotal = sellAmount * unformat(sellPrice)

      this.setState({
        sellAmount: formatNumber(sellAmount, {precision: amountPrecision}),
        sellTotal: formatNumber(sellTotal, {precision: pricePrecision}),
      })
    }
  }

  isInvalidInput(side: SIDE) {
    const { 
      buyPrice, 
      sellPrice, 
      buyAmount, 
      sellAmount, 
    } = this.state

    const {
      makeFee,
      quoteTokenDecimals,
      quoteTokenBalance,
      baseTokenBalance,
    } = this.props

    const formattedMakeFee = makeFee && utils.formatUnits(makeFee, quoteTokenDecimals)
    const maxQuoteTokenAmount = quoteTokenBalance - Number(formattedMakeFee)
    const buyMaxAmount = maxQuoteTokenAmount / unformat(buyPrice)
    const sellMaxAmount = baseTokenBalance

    if (side === 'BUY') { 
      switch (true) {
        case (unformat(buyPrice) === 0):
          return {
            type: 'price',
            message: 'Please input price',
          }

        case (unformat(buyAmount) === 0):
          return {
            type: 'amount',
            message: 'Please input amount',
          }
        case (buyAmount > buyMaxAmount):
          return {
            type: 'total',
            message: 'Your balance is not enough',
          }
        default:
          return null 
      }
    } else {
      switch(true) {
        case (unformat(sellPrice) === 0):
          return {
            type: 'price',
            message: 'Please input price',
          }
        case (unformat(sellAmount) === 0):
          return {
            type: 'amount',
            message: 'Please input amount',
          }
        case (sellAmount > sellMaxAmount):
          return {
            type: 'total',
            message: 'Your balance is not enough',
          }
        default:
          return null
      }
    }
  }

  resetErrorObject = (side: SIDE) => {
    switch (side) {
      case 'BUY':
        this.setState({
          errorBuy: null,
        })

        break
      case 'SELL':
        this.setState({
          errorSell: null,
        })

        break
      default:
        this.setState({
          errorBuy: null,
          errorSell: null,
        })
    }
  }

  onInputFocus = (side: SIDE, { target }: Object) => {
    if (target.name === 'amount') {
      (side === 'BUY') ? this.setState({ isShowBuyMaxAmount: true }) : this.setState({ isShowSellMaxAmount: true })
    }
  }

  onInputBlur = (side: SIDE, { target }: Object) => {
    if (target.name === 'amount') {
      (side === 'BUY') ? this.setState({ isShowBuyMaxAmount: false }) : this.setState({ isShowSellMaxAmount: false })
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
        errorBuy,
        errorSell,
        isShowBuyMaxAmount,
        isShowSellMaxAmount,
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
        authenticated,
        redirectToLoginPage,
      },
      onInputChange,
      onInputFocus,
      onInputBlur,
      handleChangeOrderType,
      handleUnlockPair,
      toggleCollapse,
      handleSendOrder,
      handleSideChange,
      handleDecreasePrice,
      handleIncreasePrice,
      handleDecreaseAmount,
      handleIncreaseAmount,
      buyPriceInput,
      sellPriceInput,
      buyAmountInput,
      sellAmountInput,
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

    if (unformat(buyPrice)) {
      buyMaxAmount = formatNumber(maxQuoteTokenAmount / unformat(buyPrice), { decimals: 3 })
    } else {
      buyMaxAmount = '0.0'
    }

    sellMaxAmount = formatNumber(baseTokenBalance, { decimals: 3 })

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
        onInputFocus={onInputFocus}
        onInputBlur={onInputBlur}
        handleUnlockPair={handleUnlockPair}
        toggleCollapse={toggleCollapse}
        handleChangeOrderType={handleChangeOrderType}
        handleSendOrder={handleSendOrder}
        handleSideChange={handleSideChange}
        handleDecreasePrice={handleDecreasePrice}
        handleIncreasePrice={handleIncreasePrice}
        handleDecreaseAmount={handleDecreaseAmount}
        handleIncreaseAmount={handleIncreaseAmount}
        errorBuy={errorBuy}
        errorSell={errorSell}
        isShowBuyMaxAmount={isShowBuyMaxAmount}
        isShowSellMaxAmount={isShowSellMaxAmount}
        buyPriceInput={buyPriceInput}
        sellPriceInput={sellPriceInput}
        buyAmountInput={buyAmountInput}
        sellAmountInput={sellAmountInput}
        authenticated={authenticated}
        redirectToLoginPage={redirectToLoginPage}
      />
    )
  }
}

export default OrderForm
