// @flow
import React from 'react'
import { unformat } from 'accounting-js'
import BigNumber from 'bignumber.js'
import toDecimalFormString from 'number-to-decimal-form-string-x'

import type { Side } from '../../../types/orders'
import OrderFormRenderer from './OrderFormRenderer'
import { isTomoWallet, isMobile } from '../../../utils/helpers'

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
  fraction: number,
  priceType: string,
  borrowInterest: string,
  lendInterest: string,
  borrowAmount: string,
  lendAmount: string,
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
    side: 'BORROW',
    fraction: 0,
    priceType: 'null',
    borrowInterest: '',
    lendInterest: '',
    borrowAmount: '',
    lendAmount: '',
    interestStep: toDecimalFormString(1/Math.pow(10, 2)),
    amountStep: toDecimalFormString(1/Math.pow(10, 0)),
    errorBuy: null,
    errorSell: null,
    isShowBuyMaxAmount: false,
    isShowSellMaxAmount: false,
    dirtyPriceForm: false,
    collateralTokenSelected: null,
    profit: '',
  }

  buyPriceInput = React.createRef()
  sellPriceInput = React.createRef()
  buyAmountInput = React.createRef()
  sellAmountInput = React.createRef()

  componentDidUpdate(prevProps) {
    if (!prevProps.collateralTokens
      && this.props.collateralTokens) {
      this.setState({
        collateralTokenSelected: this.props.collateralTokens[0],
      })
    }

    // const prevSelectedOrder = prevProps.selectedOrder
    // const currSelectedOrder = this.props.selectedOrder
    // const { currentPairData } = this.props
    // const { dirtyPriceForm } = this.state

    // if (currentPairData 
    //   && currentPairData.pricePrecision
    //   && ((currentPairData.pricePrecision !== this.state.pricePrecision)
    //     || (currentPairData.amountPrecision !== this.state.amountPrecision))
    //   ) {
    //   const { pricePrecision, amountPrecision } = currentPairData

    //   this.setState({
    //     pricePrecision,
    //     amountPrecision,
    //     interestStep: toDecimalFormString(1/Math.pow(10, pricePrecision)),
    //     amountStep: toDecimalFormString(1/Math.pow(10, amountPrecision)),
    //   })
    // }

    // currentPair and currentPairData changed and ready at different times
    // so we use dirtyPriceForm to indicate token pair changed & order form is refresh
    // and when currenPairData ready we will add price to form
    // if (prevProps.currentPair.pair !== this.props.currentPair.pair) {
    //   this.setState({dirtyPriceForm: false})
    // }

    // if (!dirtyPriceForm && currentPairData) {
    //   const { price, pricePrecision } = currentPairData
    //   const priceFormated = BigNumber(price).toFixed(pricePrecision)

    //   return this.setState({ 
    //     borrowInterest: priceFormated, 
    //     lendInterest: priceFormated,
    //     borrowAmount: '',
    //     lendAmount: '',
    //     buyTotal: '',
    //     sellTotal: '',
    //     dirtyPriceForm: true,
    //   }) 
    // }

    // if(!prevSelectedOrder && currSelectedOrder) {
    //   return this.setOrderByChoose(currSelectedOrder)
    // }

    // if (prevSelectedOrder 
    //   && (prevSelectedOrder.price !== currSelectedOrder.price
    //   || prevSelectedOrder.type !== currSelectedOrder.type)) {

    //   return this.setOrderByChoose(currSelectedOrder)  
    // }  
  }

  // setOrderByChoose(order) {    
  //   const { pricePrecision, amountPrecision } = this.state

  //   this.resetErrorObject()
  //   const { authenticated } = this.props
  //   let { type, price, total, side } = order
  //   const oppositeSide = (side === 'BORROW') ? 'LEND' : 'BORROW'

  //   const priceFormated = BigNumber(price).toFixed(pricePrecision)

  //   if (type === 'amount') {
  //     if (isTomoWallet() || isMobile()) return
  //     if (side === 'BORROW') {
  //       this.setState({
  //         borrowInterest: priceFormated, 
  //         lendInterest: priceFormated,
  //         borrowAmount: '',
  //         buyTotal: '',
  //       }, _ => {
  //         let amountFormated = BigNumber(total).toFixed(amountPrecision)

  //         if (authenticated) {
  //           let { sellMaxAmount } = this.calcMaxAmount(priceFormated)
  //           sellMaxAmount = BigNumber(sellMaxAmount).gt(0) ? sellMaxAmount : ''
  //           amountFormated = BigNumber(amountFormated).lte(sellMaxAmount) ? amountFormated : sellMaxAmount
  //         }

  //         this.handleAmountChange(amountFormated, oppositeSide)
  //       })
  //     } else {
  //       this.setState({
  //         borrowInterest: priceFormated, 
  //         lendInterest: priceFormated,
  //         lendAmount: '',
  //         sellTotal: '',
  //       }, _ => {
  //         let amountFormated = BigNumber(total).toFixed(amountPrecision)
  //         if (authenticated) {
  //           let { buyMaxAmount } = this.calcMaxAmount(priceFormated)

  //           buyMaxAmount = BigNumber(buyMaxAmount).gt(0) ? buyMaxAmount : ''
  //           amountFormated = BigNumber(amountFormated).lte(buyMaxAmount) ? amountFormated : buyMaxAmount
  //         }

  //         this.handleAmountChange(amountFormated, oppositeSide)
  //       })
  //     }
  //   } else {      
  //     // eslint-disable-next-line no-lonely-if
  //     if (side === 'BORROW') {
  //       this.setState({
  //         borrowInterest: priceFormated, 
  //         lendInterest: priceFormated,
  //         borrowAmount: '',
  //         buyTotal: '',
  //       }, _ => {
  //         if (authenticated && this.state.lendAmount) {
  //           let sellAmountFormated = BigNumber(this.state.lendAmount).toFixed(amountPrecision)
  //           let { sellMaxAmount } = this.calcMaxAmount(priceFormated)
  //           sellMaxAmount = BigNumber(sellMaxAmount).gt(0) ? sellMaxAmount : ''
  //           sellAmountFormated = BigNumber(sellAmountFormated).lte(sellMaxAmount) ? sellAmountFormated : sellMaxAmount
            
  //           this.handleAmountChange(sellAmountFormated, oppositeSide)
  //         } else {
  //           this.handleInterestChange(priceFormated, oppositeSide)
  //         }          
  //       })
  //     } else {
  //       this.setState({
  //         borrowInterest: priceFormated, 
  //         lendInterest: priceFormated,
  //         lendAmount: '',
  //         sellTotal: '',
  //       }, _ => {
  //         if (authenticated && this.state.borrowAmount) {
  //           let buyAmountFormated = BigNumber(this.state.borrowAmount).toFixed(amountPrecision)
  //           let { buyMaxAmount } = this.calcMaxAmount(priceFormated)
  //           buyMaxAmount = BigNumber(buyMaxAmount).gt(0) ? buyMaxAmount : ''
  //           buyAmountFormated = BigNumber(buyAmountFormated).lte(buyMaxAmount) ? buyAmountFormated : buyMaxAmount
            
  //           this.handleAmountChange(buyAmountFormated, oppositeSide)
  //         } else {
  //           this.handleInterestChange(priceFormated, oppositeSide)
  //         } 
  //       })
  //     }
  //   }
  // }

  onInputChange = (side: SIDE = 'BORROW', { target }: Object) => {
    const { authenticated } = this.props
    const interestPrecision = 2
    const amountPrecision = 2
    let { value } = target

    value = value.replace(/[^0-9.]/g, '').replace(/^0+/g, '0')    
    value = value.match(/^0[1-9]/g) ? value.replace(/^0/, '') : value
    value = value.match(/^\.[1-9]*/g) ? value.replace(/^./, '0.') : value
    value = value.match(/^[0-9]*\.[0-9]*\.$/g) ? value.replace(/.$/, '') : value

    switch (target.name) {
      case 'interest':        
        const interestPattern = new RegExp(`^[0-9]*\\.[0-9]{${interestPrecision + 1},}$`, 'g')
        if (interestPattern.test(value)) return
        this.handleInterestChange(value, side)
        break      
      case 'amount':
        const amountPattern = new RegExp(`^[0-9]*\\.[0-9]{${amountPrecision + 1},}$`, 'g')
        if (amountPattern.test(value)) return
        this.handleAmountChange(value, side)
        break
      case 'fraction':
        authenticated && this.handleUpdateAmountFraction(value, side)
        break
      default:
        break
    }
  }

  handleInterestChange = (interest, side) => {
    this.resetErrorObject(side)

    if (side === 'BORROW') {
      this.setState({ borrowInterest: interest })
    } else { 
      const { lendAmount } = this.state

      if (Number(interest) && Number(lendAmount)) {
        const rate = BigNumber(interest).div(100)
        const profitPerYear = rate.times(lendAmount)
        const profitPerDay = profitPerYear.div(365)
        const profit = profitPerDay.toFixed(2) //TODO: need calc by current term

        return this.setState({
          lendInterest: interest,
          profit,
        })
      }
        
      this.setState({ lendInterest: interest })
    }    
  }

  handleAmountChange = (amount, side) => {
    this.resetErrorObject(side)

    if (side === 'BORROW') {
      this.setState({ borrowAmount: amount })
    } else {
      const { lendInterest } = this.state

      if (Number(amount) && Number(lendInterest)) {
        const rate = BigNumber(lendInterest).div(100)
        const profitPerYear = rate.times(amount)
        const profitPerDay = profitPerYear.div(365)
        const profit = profitPerDay.toFixed(2) //TODO: need calc by current term

        return this.setState({
          lendAmount: amount,
          profit,
        })
      }

      this.setState({ lendAmount: amount })
    }
  }

  handleSendOrder = (side: SIDE) => {

    // const error = this.isInvalidInput(side)
    // if (error) {
    //   (side === 'BORROW') ? this.setState({ errorBuy: error }) : this.setState({ errorSell: error })
    //   return
    // }

    const { borrowInterest, lendInterest, borrowAmount, lendAmount, collateralTokenSelected } = this.state
    const { sendNewLendingOrder } = this.props

    if (side === 'BORROW'){
      const order = {
        side, 
        amount: borrowAmount, 
        interest: borrowInterest,
        collateralToken: collateralTokenSelected.address,
      }

      sendNewLendingOrder(order)
    } else {
      const order = {
        side, 
        amount: lendAmount, 
        interest: lendInterest,
        collateralToken: collateralTokenSelected.address, //TODO: remove collateral token when update
      }

      sendNewLendingOrder(order)
    }                    
  }

  handleUpdateAmountFraction = (fraction: string, side: SIDE) => {
    const { pricePrecision, amountPrecision } = this.state
    const { quoteTokenBalance, baseTokenBalance, authenticated, fee } = this.props
    if (!authenticated) return

    if (side === 'LEND') {
      const { lendInterest } = this.state
      if (!lendInterest || Number(lendInterest) === 0) return

      const bigSellAmount = (BigNumber(baseTokenBalance).div(100)).times(fraction)
      const bigSellTotal = BigNumber(lendInterest).times(bigSellAmount)

      this.setState({
        fraction,
        lendAmount: bigSellAmount.toFixed(amountPrecision),
        sellTotal: bigSellTotal.toFixed(pricePrecision),
        errorBuy: null,
        errorSell: null,
      })
    } else {
      const { borrowInterest } = this.state
      if (!borrowInterest || Number(borrowInterest) === 0) return

      let bigBuyTotal = (BigNumber(quoteTokenBalance).div(100)).times(fraction)
      let bigBuyAmount = ''

      if (+fraction === 100) {
        const multiplier = Math.pow(10, 18)
        const bigBuyTotalMultiplier = BigNumber(quoteTokenBalance).times(multiplier).div(1 + fee)
        const bigBuyAmountMultiplier = bigBuyTotalMultiplier.div(borrowInterest)
        bigBuyTotal = bigBuyTotalMultiplier.div(multiplier)      
        bigBuyAmount = bigBuyAmountMultiplier.div(multiplier)
      } else {
        bigBuyAmount = bigBuyTotal.div(borrowInterest)
      }

      this.setState({
        fraction,
        borrowAmount: bigBuyAmount.toFixed(amountPrecision),
        buyTotal: bigBuyTotal.toFixed(pricePrecision),
        errorBuy: null,
        errorSell: null,
      })
    }
  }

  handleCollateralSelect = (collateralToken) => {    
    this.setState({
      collateralTokenSelected: collateralToken,
    })
  }

  handleDecreasePrice = (event, side: SIDE) => {
    event.preventDefault()

    let {
      state: {
        borrowInterest, 
        lendInterest, 
        borrowAmount, 
        lendAmount, 
        interestStep,
        pricePrecision,
      },
      buyPriceInput,
      sellPriceInput,
    } = this

    if (side === 'BORROW') {
      buyPriceInput.current.focus()

      borrowInterest = borrowInterest ? borrowInterest : 0
      let bigBuyPrice = BigNumber(borrowInterest).minus(BigNumber(interestStep))
      bigBuyPrice = bigBuyPrice.gt(BigNumber(interestStep)) ? bigBuyPrice : BigNumber(interestStep)

      if (borrowInterest && borrowAmount) {
        const bigBuyTotal = bigBuyPrice.times(borrowAmount)

        this.setState({
          borrowInterest: bigBuyPrice.toFixed(pricePrecision),
          buyTotal: bigBuyTotal.toFixed(pricePrecision),
        })
      } else {
        this.setState({
          borrowInterest: bigBuyPrice.toFixed(pricePrecision),
          buyTotal: '',
        })
      }
    } else {
      sellPriceInput.current.focus()

      lendInterest = lendInterest ? lendInterest : 0
      let bigSellPrice = BigNumber(lendInterest).minus(BigNumber(interestStep))
      bigSellPrice = bigSellPrice.gt(BigNumber(interestStep)) ? bigSellPrice : BigNumber(interestStep)

      if (lendInterest && lendAmount) {
        const bigSellTotal = bigSellPrice.times(BigNumber(lendAmount))

        this.setState({
          lendInterest: bigSellPrice.toFixed(pricePrecision),
          sellTotal: bigSellTotal.toFixed(pricePrecision),
        })
      } else {
        this.setState({
          lendInterest: bigSellPrice.toFixed(pricePrecision),
          sellTotal: '',
        })
      }
    }
  }

  handleIncreasePrice = (event, side: SIDE) => {
    event.preventDefault()

    let {
      state: {
        borrowInterest, 
        lendInterest, 
        borrowAmount, 
        lendAmount, 
        interestStep,
        pricePrecision,
      },
      buyPriceInput,
      sellPriceInput,
    } = this

    if (side === 'BORROW') {
      buyPriceInput.current.focus()

      borrowInterest = borrowInterest ? borrowInterest : 0
      const bigBuyPrice = BigNumber(borrowInterest).plus(BigNumber(interestStep))

      if (borrowInterest && borrowAmount) {
        const bigBuyTotal = bigBuyPrice.times(BigNumber(borrowAmount))

        this.setState({
          borrowInterest: bigBuyPrice.toFixed(pricePrecision),
          buyTotal: bigBuyTotal.toFixed(pricePrecision),
        })
      } else {
        this.setState({
          borrowInterest: bigBuyPrice.toFixed(pricePrecision),
          buyTotal: '',
        })
      }
    } else {
      sellPriceInput.current.focus()

      lendInterest = lendInterest ? lendInterest : 0
      const bigSellPrice = BigNumber(lendInterest).plus(BigNumber(interestStep))

      if (lendInterest && lendAmount) {
        const bigSellTotal = bigSellPrice.times(BigNumber(lendAmount))

        this.setState({
          lendInterest: bigSellPrice.toFixed(pricePrecision),
          sellTotal: bigSellTotal.toFixed(pricePrecision),
        })
      } else {
        this.setState({
          lendInterest: bigSellPrice.toFixed(pricePrecision),
          sellTotal: '',
        })
      }
    }
  }

  handleDecreaseAmount = (event, side: SIDE) => {
    event.preventDefault()

    let {
      state: {
        borrowAmount, 
        lendAmount, 
        borrowInterest, 
        lendInterest, 
        amountStep,
        amountPrecision,
      },
      buyAmountInput,
      sellAmountInput,
    } = this

    if (side === 'BORROW') {
      buyAmountInput.current.focus()

      borrowAmount = borrowAmount ? borrowAmount : 0
      let bigBuyAmount = BigNumber(borrowAmount).minus(BigNumber(amountStep)) 
      bigBuyAmount = bigBuyAmount.gt(BigNumber(amountStep)) ? bigBuyAmount : BigNumber(amountStep)

      if (borrowAmount && borrowInterest) {
        const bigBuyTotal = bigBuyAmount.times(BigNumber(borrowInterest))

        this.setState({
          borrowAmount: bigBuyAmount.toFixed(amountPrecision),
          buyTotal: bigBuyTotal.toFixed(amountPrecision),
        })
      } else {
        this.setState({
          borrowAmount: bigBuyAmount.toFixed(amountPrecision),
          buyTotal: '',
        })
      }
    } else {
      sellAmountInput.current.focus()

      lendAmount = lendAmount ? lendAmount : 0
      let bigSellAmount = BigNumber(lendAmount).minus(BigNumber(amountStep))
      bigSellAmount = bigSellAmount.gt(BigNumber(amountStep)) ? bigSellAmount : BigNumber(amountStep)

      if (lendAmount && lendInterest) {
        const bigSellTotal = bigSellAmount.times(BigNumber(lendInterest))
        
        this.setState({
          lendAmount: bigSellAmount.toFixed(amountPrecision),
          sellTotal: bigSellTotal.toFixed(amountPrecision),
        })
      } else {
        this.setState({
          lendAmount: bigSellAmount.toFixed(amountPrecision),
          sellTotal: '',
        })
      }
    }
  }

  handleIncreaseAmount = (event, side: SIDE) => {
    event.preventDefault()

    let {
      state: {
        borrowAmount, 
        lendAmount, 
        borrowInterest, 
        lendInterest, 
        amountStep,
        amountPrecision,
      }, 
      buyAmountInput, 
      sellAmountInput,
    } = this

    borrowInterest = borrowInterest ? borrowInterest : 0
    lendInterest = lendInterest ? lendInterest : 0
    borrowAmount = borrowAmount ? borrowAmount : 0
    lendAmount = lendAmount ? lendAmount : 0 

    if (side === 'BORROW') {
      buyAmountInput.current.focus()

      borrowAmount = borrowAmount ? borrowAmount : 0
      const bigBuyAmount = BigNumber(borrowAmount).plus(BigNumber(amountStep))

      if (borrowAmount && borrowInterest) {
        const bigBuyTotal = bigBuyAmount.times(BigNumber(borrowInterest))

        this.setState({
          borrowAmount: bigBuyAmount.toFixed(amountPrecision),
          buyTotal: bigBuyTotal.toFixed(amountPrecision),
        })
      } else {
        this.setState({
          borrowAmount: bigBuyAmount.toFixed(amountPrecision),
          buyTotal: '',
        })
      }
    } else {
      sellAmountInput.current.focus()

      lendAmount = lendAmount ? lendAmount : 0 
      const bigSellAmount = BigNumber(lendAmount).plus(BigNumber(amountStep))

      if (lendAmount && lendInterest) {
        const bigSellTotal = bigSellAmount.times(BigNumber(lendInterest))

        this.setState({
          lendAmount: bigSellAmount.toFixed(amountPrecision),
          sellTotal: bigSellTotal.toFixed(amountPrecision),
        })
      } else {
        this.setState({
          lendAmount: bigSellAmount.toFixed(amountPrecision),
          sellTotal: '',
        })
      }
    }
  }

  isInvalidInput(side: SIDE) {
    const { 
      borrowInterest, 
      lendInterest, 
      borrowAmount, 
      lendAmount, 
    } = this.state

    const {
      fee,
      quoteTokenBalance,
      baseTokenBalance,
    } = this.props

    const buyTotal = BigNumber(borrowInterest).times(borrowAmount)
    const buyFee = buyTotal.times(fee)
    const buyTotalWithFee = buyTotal.plus(buyFee)
    const sellMaxAmount = BigNumber(baseTokenBalance)

    if (side === 'BORROW') { 
      switch (true) {
        case (!borrowInterest || BigNumber(borrowInterest).eq(0)):
          return {
            type: 'price',
            message: 'Please input price',
          }

        case (!borrowAmount || BigNumber(borrowAmount).eq(0)):
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
        case (!lendInterest || BigNumber(lendInterest).eq(0)):
          return {
            type: 'price',
            message: 'Please input price',
          }
        case (!lendAmount || BigNumber(lendAmount).eq(0)):
          return {
            type: 'amount',
            message: 'Please input amount',
          }
        case (BigNumber(lendAmount).gt(sellMaxAmount)):
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
      case 'BORROW':
        this.setState({
          errorBuy: null,
        })

        break
      case 'LEND':
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
      (side === 'BORROW') ? this.setState({ isShowBuyMaxAmount: true }) : this.setState({ isShowSellMaxAmount: true })
    }
  }

  onInputBlur = (side: SIDE, { target }: Object) => {
    if (target.name === 'amount') {
      (side === 'BORROW') ? this.setState({ isShowBuyMaxAmount: false }) : this.setState({ isShowSellMaxAmount: false })
    }
  }

  calcMaxAmount = (borrowInterest) => {
    let buyMaxAmount = 0
    let sellMaxAmount = 0
    const { authenticated, quoteTokenBalance, baseTokenBalance, fee } = this.props
    const { amountPrecision } = this.state

    if (authenticated) {
      if (unformat(borrowInterest) && quoteTokenBalance) {
        const multiplier = Math.pow(10, 18)
        const bigBuyTotalMultiplier = BigNumber(quoteTokenBalance).times(multiplier).div(1 + fee)
        const bigBuyAmountMultiplier = bigBuyTotalMultiplier.div(borrowInterest)
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
        fraction,
        priceType,
        borrowInterest,
        lendInterest,
        borrowAmount,
        lendAmount,
        errorBuy,
        errorSell,
        isShowBuyMaxAmount,
        isShowSellMaxAmount,
        collateralTokenSelected,
        profit,
      },
      props: {
        baseTokenSymbol,
        quoteTokenSymbol,
        baseTokenDecimals,
        quoteTokenDecimals,
        baseTokenBalance,
        quoteTokenBalance,
        authenticated,
        redirectToLoginPage,
        loading,
        collateralTokens,
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
      handleCollateralSelect,
    } = this

    const { buyMaxAmount, sellMaxAmount } = this.calcMaxAmount(borrowInterest)

    return (
      <OrderFormRenderer
        side={side}
        fraction={fraction}
        priceType={priceType}
        borrowInterest={borrowInterest}
        lendInterest={lendInterest}
        borrowAmount={borrowAmount}
        lendAmount={lendAmount}
        buyMaxAmount={buyMaxAmount}
        sellMaxAmount={sellMaxAmount}
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
        collateralTokens={collateralTokens}
        collateralTokenSelected={collateralTokenSelected}
        onCollateralSelect={handleCollateralSelect}
        profit={profit}
      />
    )
  }
}

export default OrderForm
