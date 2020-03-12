// @flow
import React from 'react'
import { unformat } from 'accounting-js'
import BigNumber from 'bignumber.js'
import toDecimalFormString from 'number-to-decimal-form-string-x'

import type { Side, OrderType } from '../../types/orders'
import OrderFormRenderer from './OrderFormRenderer'
import { pricePrecision as defaultPricePrecision, amountPrecision as defaultAmountPrecision } from '../../config/tokens'
import { isTomoWallet, isMobile } from '../../utils/helpers'

type Props = {
  side: Side,
  askPrice: number,
  bidPrice: number,
  baseTokenBalance: number,
  quoteTokenBalance: number,
  baseTokenSymbol: string,
  quoteTokenSymbol: string,
  baseTokenDecimals: number,
  quoteTokenDecimals: number,
  fee: number,
  authenticated: boolean,
  sendNewOrder: (string, number, number) => void,
}

type State = {
  side: SIDE,
  selectedTabId: OrderType,
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
    authenticated: false,
    bidPrice: '',
    askPrice: '',
    baseTokenBalance: '',
    quoteTokenBalance: '',
  }

  state = {
    side: 'BUY',
    fraction: 0,
    isOpen: true,
    priceType: 'null',
    selectedTabId: 'LO',
    buyPrice: '',
    sellPrice: '',
    stopPrice: '',
    limitPrice: '',
    buyAmount: '',
    sellAmount: '',
    buyTotal: '',
    sellTotal: '',
    pricePrecision: defaultPricePrecision,
    amountPrecision: defaultAmountPrecision,
    priceStep: toDecimalFormString(1/Math.pow(10, defaultPricePrecision)),
    amountStep: toDecimalFormString(1/Math.pow(10, defaultAmountPrecision)),
    errorBuy: null,
    errorSell: null,
    isShowBuyMaxAmount: false,
    isShowSellMaxAmount: false,
    dirtyPriceForm: false,
  }

  buyPriceInput = React.createRef()
  sellPriceInput = React.createRef()
  buyAmountInput = React.createRef()
  sellAmountInput = React.createRef()

  componentDidUpdate(prevProps) {
    const prevSelectedOrder = prevProps.selectedOrder
    const currSelectedOrder = this.props.selectedOrder
    const { currentPairData } = this.props
    const { dirtyPriceForm } = this.state

    if (currentPairData 
      && currentPairData.pricePrecision
      && ((currentPairData.pricePrecision !== this.state.pricePrecision)
        || (currentPairData.amountPrecision !== this.state.amountPrecision))
      ) {
      const { pricePrecision, amountPrecision } = currentPairData

      this.setState({
        pricePrecision,
        amountPrecision,
        priceStep: toDecimalFormString(1/Math.pow(10, pricePrecision)),
        amountStep: toDecimalFormString(1/Math.pow(10, amountPrecision)),
      })
    }

    if (prevProps.loading && !this.props.loading) {
      return this.setState({ 
        buyAmount: '',
        sellAmount: '',
        buyTotal: '',
        sellTotal: '',
      })
    }

    // currentPair and currentPairData changed and ready at different times
    // so we use dirtyPriceForm to indicate token pair changed & order form is refresh
    // and when currenPairData ready we will add price to form
    if (prevProps.currentPair.pair !== this.props.currentPair.pair) {
      this.setState({dirtyPriceForm: false})
    }

    if (!dirtyPriceForm && currentPairData) {
      const { price, pricePrecision } = currentPairData
      const priceFormated = BigNumber(price).toFixed(pricePrecision)

      return this.setState({ 
        buyPrice: priceFormated, 
        sellPrice: priceFormated,
        buyAmount: '',
        sellAmount: '',
        buyTotal: '',
        sellTotal: '',
        dirtyPriceForm: true,
      }) 
    }

    if(!prevSelectedOrder && currSelectedOrder) {
      return this.setOrderByChoose(currSelectedOrder)
    }

    if (prevSelectedOrder 
      && (prevSelectedOrder.price !== currSelectedOrder.price
      || prevSelectedOrder.type !== currSelectedOrder.type)) {

      return this.setOrderByChoose(currSelectedOrder)  
    }  
  }

  setOrderByChoose(order) {    
    const { pricePrecision, amountPrecision, selectedTabId } = this.state
    if (selectedTabId === 'MO') return 

    this.resetErrorObject()
    const { authenticated } = this.props
    let { type, price, total, side } = order
    const oppositeSide = (side === 'BUY') ? 'SELL' : 'BUY'

    const priceFormated = BigNumber(price).toFixed(pricePrecision)

    if (type === 'amount') {
      if (isTomoWallet() || isMobile()) return
      if (side === 'BUY') {
        this.setState({
          buyPrice: priceFormated, 
          sellPrice: priceFormated,
          buyAmount: '',
          buyTotal: '',
        }, _ => {
          let amountFormated = BigNumber(total).toFixed(amountPrecision)

          if (authenticated) {
            let { sellMaxAmount } = this.calcMaxAmount(priceFormated)
            sellMaxAmount = BigNumber(sellMaxAmount).gt(0) ? sellMaxAmount : ''
            amountFormated = BigNumber(amountFormated).lte(sellMaxAmount) ? amountFormated : sellMaxAmount
          }

          this.handleAmountChange(amountFormated, oppositeSide)
        })
      } else {
        this.setState({
          buyPrice: priceFormated, 
          sellPrice: priceFormated,
          sellAmount: '',
          sellTotal: '',
        }, _ => {
          let amountFormated = BigNumber(total).toFixed(amountPrecision)
          if (authenticated) {
            let { buyMaxAmount } = this.calcMaxAmount(priceFormated)

            buyMaxAmount = BigNumber(buyMaxAmount).gt(0) ? buyMaxAmount : ''
            amountFormated = BigNumber(amountFormated).lte(buyMaxAmount) ? amountFormated : buyMaxAmount
          }

          this.handleAmountChange(amountFormated, oppositeSide)
        })
      }
    } else {      
      // eslint-disable-next-line no-lonely-if
      if (side === 'BUY') {
        this.setState({
          buyPrice: priceFormated, 
          sellPrice: priceFormated,
          buyAmount: '',
          buyTotal: '',
        }, _ => {
          if (authenticated && this.state.sellAmount) {
            let sellAmountFormated = BigNumber(this.state.sellAmount).toFixed(amountPrecision)
            let { sellMaxAmount } = this.calcMaxAmount(priceFormated)
            sellMaxAmount = BigNumber(sellMaxAmount).gt(0) ? sellMaxAmount : ''
            sellAmountFormated = BigNumber(sellAmountFormated).lte(sellMaxAmount) ? sellAmountFormated : sellMaxAmount
            
            this.handleAmountChange(sellAmountFormated, oppositeSide)
          } else {
            this.handlePriceChange(priceFormated, oppositeSide)
          }          
        })
      } else {
        this.setState({
          buyPrice: priceFormated, 
          sellPrice: priceFormated,
          sellAmount: '',
          sellTotal: '',
        }, _ => {
          if (authenticated && this.state.buyAmount) {
            let buyAmountFormated = BigNumber(this.state.buyAmount).toFixed(amountPrecision)
            let { buyMaxAmount } = this.calcMaxAmount(priceFormated)
            buyMaxAmount = BigNumber(buyMaxAmount).gt(0) ? buyMaxAmount : ''
            buyAmountFormated = BigNumber(buyAmountFormated).lte(buyMaxAmount) ? buyAmountFormated : buyMaxAmount
            
            this.handleAmountChange(buyAmountFormated, oppositeSide)
          } else {
            this.handlePriceChange(priceFormated, oppositeSide)
          } 
        })
      }
    }
  }

  onInputChange = (side: SIDE = 'BUY', { target }: Object) => {
    const { authenticated } = this.props
    const { pricePrecision, amountPrecision } = this.state
    let { value } = target

    value = value.replace(/[^0-9.]/g, '').replace(/^0+/g, '0')    
    value = value.match(/^0[1-9]/g) ? value.replace(/^0/, '') : value
    value = value.match(/^\.[1-9]*/g) ? value.replace(/^./, '0.') : value
    value = value.match(/^[0-9]*\.[0-9]*\.$/g) ? value.replace(/.$/, '') : value

    switch (target.name) {
      // case 'stopPrice':
      //   this.handleStopPriceChange(value)
      //   break
      case 'price':
        const pricePattern = new RegExp(`^[0-9]*\\.[0-9]{${pricePrecision + 1},}$`, 'g')
        if (pricePattern.test(value)) return
        this.handlePriceChange(value, side)
        break      
      case 'amount':
        const amountPattern = new RegExp(`^[0-9]*\\.[0-9]{${amountPrecision + 1},}$`, 'g')
        if (amountPattern.test(value)) return
        this.handleAmountChange(value, side)
        break
      case 'fraction':
        authenticated && this.handleUpdateAmountFraction(value, side)
        break
      case 'total':
        const totalPattern = new RegExp(`^[0-9]*\\.[0-9]{${defaultPricePrecision + 1},}$`, 'g')
        if (totalPattern.test(value)) return
        this.handleTotalChange(value, side)
        break
      default:
        break
    }
  }

  handleSendOrder = (side: SIDE) => {
    const { selectedTabId } = this.state
    const error = this.isInvalidInput(side)
    if (error) {
      (side === 'BUY') ? this.setState({ errorBuy: error }) : this.setState({ errorSell: error })
      return
    }

    const { buyPrice, sellPrice, buyAmount, sellAmount } = this.state

    if (side === 'BUY'){
      this.props.sendNewOrder(side, selectedTabId, unformat(buyAmount), unformat(buyPrice))
    } else {
      this.props.sendNewOrder(side, selectedTabId, unformat(sellAmount), unformat(sellPrice))
    }
  }

  handleUpdateAmountFraction = (fraction: string, side: SIDE) => {
    const { pricePrecision, amountPrecision } = this.state
    const { quoteTokenBalance, baseTokenBalance, authenticated, fee } = this.props
    if (!authenticated) return

    if (side === 'SELL') {
      const { sellPrice } = this.state
      if (!sellPrice || Number(sellPrice) === 0) return

      const bigSellAmount = (BigNumber(baseTokenBalance).div(100)).times(fraction)
      const bigSellTotal = BigNumber(sellPrice).times(bigSellAmount)

      this.setState({
        fraction,
        sellAmount: bigSellAmount.toFixed(amountPrecision),
        sellTotal: bigSellTotal.toFixed(pricePrecision),
        errorBuy: null,
        errorSell: null,
      })
    } else {
      const { buyPrice } = this.state
      if (!buyPrice || Number(buyPrice) === 0) return

      let bigBuyTotal = (BigNumber(quoteTokenBalance).div(100)).times(fraction)
      let bigBuyAmount = ''

      if (+fraction === 100) {
        const multiplier = Math.pow(10, 18)
        const bigBuyTotalMultiplier = BigNumber(quoteTokenBalance).times(multiplier).div(1 + fee)
        const bigBuyAmountMultiplier = bigBuyTotalMultiplier.div(buyPrice)
        bigBuyTotal = bigBuyTotalMultiplier.div(multiplier)      
        bigBuyAmount = bigBuyAmountMultiplier.div(multiplier)
      } else {
        bigBuyAmount = bigBuyTotal.div(buyPrice)
      }

      this.setState({
        fraction,
        buyAmount: bigBuyAmount.toFixed(amountPrecision),
        buyTotal: bigBuyTotal.toFixed(pricePrecision),
        errorBuy: null,
        errorSell: null,
      })
    }
  }

  handlePriceChange = (price: string, side: SIDE) => {
    this.resetErrorObject(side)

    if (side === 'BUY') {
      const { buyAmount } = this.state

      if (price && buyAmount) {
        const bigBuyTotal = BigNumber(buyAmount).times(BigNumber(price))

        this.setState({
          buyTotal: bigBuyTotal.toFixed(defaultPricePrecision),
          buyPrice: price,
        })
      } else {
        this.setState({
          buyTotal: '',
          buyPrice: price,
        })
      }
    } else {      
      const { sellAmount } = this.state

      if (price && sellAmount) {
        const bigSellTotal = BigNumber(sellAmount).times(BigNumber(price))

        this.setState({
          sellTotal: bigSellTotal.toFixed(defaultPricePrecision),
          sellPrice: price,
        })
      } else {
        this.setState({
          sellTotal: '',
          sellPrice: price,
        })
      }
    }    
  }

  handleStopPriceChange = (stopPrice: string) => {
    let { amount } = this.state

    amount = unformat(amount)
    const total = amount * unformat(stopPrice)

    this.setState({
      total,
      amount,
      stopPrice,
    })
  }

  handleAmountChange = (amount: string, side: SIDE) => {
    this.resetErrorObject(side)
    const { selectedTabId } = this.state

    if (side === 'BUY') {
      const { buyPrice, stopPrice } = this.state

      if (amount && buyPrice) {
        let bigBuyTotal

        selectedTabId === 'stop'
          ? bigBuyTotal = BigNumber(stopPrice).times(BigNumber(amount))
          : bigBuyTotal = BigNumber(buyPrice).times(BigNumber(amount))

        this.setState({
          buyTotal: bigBuyTotal.toFixed(defaultPricePrecision),
          buyAmount: amount,
          // isShowBuyMaxAmount: true,
        })
      } else {
        this.setState({
          buyAmount: amount,
          buyTotal: '',
        })
      }
    } else {
      const { sellPrice, stopPrice } = this.state

      if (amount && sellPrice) {
        let bigSellTotal

        selectedTabId === 'stop'
          ? bigSellTotal = BigNumber(stopPrice).times(BigNumber(amount))
          : bigSellTotal = BigNumber(sellPrice).times(BigNumber(amount))

        this.setState({
          sellTotal: bigSellTotal.toFixed(defaultPricePrecision),
          sellAmount: amount,
          // isShowSellMaxAmount: true,
        })
      } else {
        this.setState({
          sellAmount: amount,
          sellTotal: '',
        })
      }
    }
  }

  handleTotalChange = (total: string, side: SIDE) => {
    this.resetErrorObject(side)
    const { sellPrice, buyPrice, amountPrecision } = this.state

    if (side === 'BUY') {
      let bigBuyTotal = BigNumber(total)
      let bigBuyPrice = BigNumber(buyPrice)

      if (buyPrice && total) {
        const bigBuyAmount = bigBuyTotal.div(bigBuyPrice)

        this.setState({
          buyTotal: total,
          buyAmount: bigBuyAmount.toFixed(amountPrecision),
        })
      } else {
        this.setState({
          buyTotal: total,
          buyAmount: '',
        })
      }
    } else {
      let bigSellTotal = BigNumber(total)
      let bigSellPrice = BigNumber(sellPrice)

      if (sellPrice && total) {
        const bigSellAmount = bigSellTotal.div(bigSellPrice)

        this.setState({
          sellTotal: total,
          sellAmount: bigSellAmount.toFixed(amountPrecision),
        })
      } else {
        this.setState({
          sellTotal: total,
          sellAmount: '',
        })
      }
    }
  }

  handleChangeOrderType = (tabId: string) => {
    this.setState({
      selectedTabId: tabId,
      fraction: 0,
      buyAmount: '',
      sellAmount: '',
      buyTotal: '',
      sellTotal: '',
      errorBuy: null,
      errorSell: null,
    })
  }

  handleDecreasePrice = (event, side: SIDE) => {
    event.preventDefault()

    let {
      state: {
        buyPrice, 
        sellPrice, 
        buyAmount, 
        sellAmount, 
        priceStep,
        pricePrecision,
      },
      buyPriceInput,
      sellPriceInput,
    } = this

    if (side === 'BUY') {
      buyPriceInput.current.focus()

      buyPrice = buyPrice ? buyPrice : 0
      let bigBuyPrice = BigNumber(buyPrice).minus(BigNumber(priceStep))
      bigBuyPrice = bigBuyPrice.gt(BigNumber(priceStep)) ? bigBuyPrice : BigNumber(priceStep)

      if (buyPrice && buyAmount) {
        const bigBuyTotal = bigBuyPrice.times(buyAmount)

        this.setState({
          buyPrice: bigBuyPrice.toFixed(pricePrecision),
          buyTotal: bigBuyTotal.toFixed(pricePrecision),
        })
      } else {
        this.setState({
          buyPrice: bigBuyPrice.toFixed(pricePrecision),
          buyTotal: '',
        })
      }
    } else {
      sellPriceInput.current.focus()

      sellPrice = sellPrice ? sellPrice : 0
      let bigSellPrice = BigNumber(sellPrice).minus(BigNumber(priceStep))
      bigSellPrice = bigSellPrice.gt(BigNumber(priceStep)) ? bigSellPrice : BigNumber(priceStep)

      if (sellPrice && sellAmount) {
        const bigSellTotal = bigSellPrice.times(BigNumber(sellAmount))

        this.setState({
          sellPrice: bigSellPrice.toFixed(pricePrecision),
          sellTotal: bigSellTotal.toFixed(pricePrecision),
        })
      } else {
        this.setState({
          sellPrice: bigSellPrice.toFixed(pricePrecision),
          sellTotal: '',
        })
      }
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
        priceStep,
        pricePrecision,
      },
      buyPriceInput,
      sellPriceInput,
    } = this

    if (side === 'BUY') {
      buyPriceInput.current.focus()

      buyPrice = buyPrice ? buyPrice : 0
      const bigBuyPrice = BigNumber(buyPrice).plus(BigNumber(priceStep))

      if (buyPrice && buyAmount) {
        const bigBuyTotal = bigBuyPrice.times(BigNumber(buyAmount))

        this.setState({
          buyPrice: bigBuyPrice.toFixed(pricePrecision),
          buyTotal: bigBuyTotal.toFixed(pricePrecision),
        })
      } else {
        this.setState({
          buyPrice: bigBuyPrice.toFixed(pricePrecision),
          buyTotal: '',
        })
      }
    } else {
      sellPriceInput.current.focus()

      sellPrice = sellPrice ? sellPrice : 0
      const bigSellPrice = BigNumber(sellPrice).plus(BigNumber(priceStep))

      if (sellPrice && sellAmount) {
        const bigSellTotal = bigSellPrice.times(BigNumber(sellAmount))

        this.setState({
          sellPrice: bigSellPrice.toFixed(pricePrecision),
          sellTotal: bigSellTotal.toFixed(pricePrecision),
        })
      } else {
        this.setState({
          sellPrice: bigSellPrice.toFixed(pricePrecision),
          sellTotal: '',
        })
      }
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
        amountStep,
        amountPrecision,
      },
      buyAmountInput,
      sellAmountInput,
    } = this

    if (side === 'BUY') {
      buyAmountInput.current.focus()

      buyAmount = buyAmount ? buyAmount : 0
      let bigBuyAmount = BigNumber(buyAmount).minus(BigNumber(amountStep)) 
      bigBuyAmount = bigBuyAmount.gt(BigNumber(amountStep)) ? bigBuyAmount : BigNumber(amountStep)

      if (buyAmount && buyPrice) {
        const bigBuyTotal = bigBuyAmount.times(BigNumber(buyPrice))

        this.setState({
          buyAmount: bigBuyAmount.toFixed(amountPrecision),
          buyTotal: bigBuyTotal.toFixed(amountPrecision),
        })
      } else {
        this.setState({
          buyAmount: bigBuyAmount.toFixed(amountPrecision),
          buyTotal: '',
        })
      }
    } else {
      sellAmountInput.current.focus()

      sellAmount = sellAmount ? sellAmount : 0
      let bigSellAmount = BigNumber(sellAmount).minus(BigNumber(amountStep))
      bigSellAmount = bigSellAmount.gt(BigNumber(amountStep)) ? bigSellAmount : BigNumber(amountStep)

      if (sellAmount && sellPrice) {
        const bigSellTotal = bigSellAmount.times(BigNumber(sellPrice))
        
        this.setState({
          sellAmount: bigSellAmount.toFixed(amountPrecision),
          sellTotal: bigSellTotal.toFixed(amountPrecision),
        })
      } else {
        this.setState({
          sellAmount: bigSellAmount.toFixed(amountPrecision),
          sellTotal: '',
        })
      }
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
        amountStep,
        amountPrecision,
      }, 
      buyAmountInput, 
      sellAmountInput,
    } = this

    buyPrice = buyPrice ? buyPrice : 0
    sellPrice = sellPrice ? sellPrice : 0
    buyAmount = buyAmount ? buyAmount : 0
    sellAmount = sellAmount ? sellAmount : 0 

    if (side === 'BUY') {
      buyAmountInput.current.focus()

      buyAmount = buyAmount ? buyAmount : 0
      const bigBuyAmount = BigNumber(buyAmount).plus(BigNumber(amountStep))

      if (buyAmount && buyPrice) {
        const bigBuyTotal = bigBuyAmount.times(BigNumber(buyPrice))

        this.setState({
          buyAmount: bigBuyAmount.toFixed(amountPrecision),
          buyTotal: bigBuyTotal.toFixed(amountPrecision),
        })
      } else {
        this.setState({
          buyAmount: bigBuyAmount.toFixed(amountPrecision),
          buyTotal: '',
        })
      }
    } else {
      sellAmountInput.current.focus()

      sellAmount = sellAmount ? sellAmount : 0 
      const bigSellAmount = BigNumber(sellAmount).plus(BigNumber(amountStep))

      if (sellAmount && sellPrice) {
        const bigSellTotal = bigSellAmount.times(BigNumber(sellPrice))

        this.setState({
          sellAmount: bigSellAmount.toFixed(amountPrecision),
          sellTotal: bigSellTotal.toFixed(amountPrecision),
        })
      } else {
        this.setState({
          sellAmount: bigSellAmount.toFixed(amountPrecision),
          sellTotal: '',
        })
      }
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
      fee,
      quoteTokenBalance,
      baseTokenBalance,
    } = this.props

    const buyTotal = BigNumber(buyPrice).times(buyAmount)
    const buyFee = buyTotal.times(fee)
    const buyTotalWithFee = buyTotal.plus(buyFee)
    const sellMaxAmount = BigNumber(baseTokenBalance)

    if (side === 'BUY') { 
      switch (true) {
        case (!buyPrice || BigNumber(buyPrice).eq(0)):
          return {
            type: 'price',
            message: 'Please input price',
          }

        case (!buyAmount || BigNumber(buyAmount).eq(0)):
          return {
            type: 'amount',
            message: 'Please input amount',
          }
        case (buyTotalWithFee.gt(quoteTokenBalance)):
          return {
            type: 'total',
            message: 'Your balance is not enough',
          }
        default:
          return null 
      }
    } else {
      switch(true) {
        case (!sellPrice || BigNumber(sellPrice).eq(0)):
          return {
            type: 'price',
            message: 'Please input price',
          }
        case (!sellAmount || BigNumber(sellAmount).eq(0)):
          return {
            type: 'amount',
            message: 'Please input amount',
          }
        case (BigNumber(sellAmount).gt(sellMaxAmount)):
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

  calcMaxAmount = (buyPrice) => {
    let buyMaxAmount = 0
    let sellMaxAmount = 0
    const { authenticated, quoteTokenBalance, baseTokenBalance, fee } = this.props
    const { amountPrecision } = this.state

    if (authenticated) {
      if (unformat(buyPrice) && quoteTokenBalance) {
        const multiplier = Math.pow(10, 18)
        const bigBuyTotalMultiplier = BigNumber(quoteTokenBalance).times(multiplier).div(1 + fee)
        const bigBuyAmountMultiplier = bigBuyTotalMultiplier.div(buyPrice)
        buyMaxAmount = bigBuyAmountMultiplier.div(multiplier).toFixed(amountPrecision)
      }

      sellMaxAmount = BigNumber(baseTokenBalance).toFixed(amountPrecision)
    }

    return { buyMaxAmount, sellMaxAmount }
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
        amountPrecision,
      },
      props: {
        baseTokenSymbol,
        quoteTokenSymbol,
        baseTokenDecimals,
        quoteTokenDecimals,
        fee,
        baseTokenBalance,
        quoteTokenBalance,
        authenticated,
        redirectToLoginPage,
        loading,
      },
      onInputChange,
      onInputFocus,
      onInputBlur,
      handleChangeOrderType,
      handleSendOrder,
      handleDecreasePrice,
      handleIncreasePrice,
      handleDecreaseAmount,
      handleIncreaseAmount,
      buyPriceInput,
      sellPriceInput,
      buyAmountInput,
      sellAmountInput,
    } = this

    const { buyMaxAmount, sellMaxAmount } = this.calcMaxAmount(buyPrice)

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
        fee={fee}
        baseTokenSymbol={baseTokenSymbol}
        quoteTokenSymbol={quoteTokenSymbol}
        baseTokenDecimals={baseTokenDecimals}
        quoteTokenDecimals={quoteTokenDecimals}
        baseTokenBalance={baseTokenBalance}
        quoteTokenBalance={quoteTokenBalance}
        onInputChange={onInputChange}
        onInputFocus={onInputFocus}
        onInputBlur={onInputBlur}
        handleChangeOrderType={handleChangeOrderType}
        handleSendOrder={handleSendOrder}
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
        loading={loading}
        amountPrecision={amountPrecision}
      />
    )
  }
}

export default OrderForm
