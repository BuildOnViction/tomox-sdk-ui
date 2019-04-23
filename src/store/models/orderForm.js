// @flow
import * as notifierActionCreators from '../actions/app'
import * as actionCreators from '../actions/orderForm'

import {
  getTokenPairsDomain,
  getOrderBookDomain,
  getAccountBalancesDomain,
  getAccountDomain,
  getTokenDomain,
  getOrdersDomain,
} from '../domains/'

import { utils } from 'ethers'
import type { State, ThunkAction } from '../../types'
import type { Side } from '../../types/orders'
import { getSigner } from '../services/signer'
import { parseNewOrderError } from '../../config/errors'
// import { joinSignature } from 'ethers/utils'
import { max, minOrderAmount } from '../../utils/helpers'

export default function getOrderFormSelector(state: State) {
  const tokenPairsDomain = getTokenPairsDomain(state)
  const orderBookDomain = getOrderBookDomain(state)
  const orderDomain = getOrdersDomain(state)
  const accountBalancesDomain = getAccountBalancesDomain(state)
  const accountDomain = getAccountDomain(state)
  const currentPair = tokenPairsDomain.getCurrentPair()
  const currentPairData = tokenPairsDomain.getCurrentPairData()

  const {
    baseTokenSymbol,
    quoteTokenSymbol,
    makeFee,
    takeFee,
    baseTokenDecimals,
    quoteTokenDecimals,
  } = currentPair

  const selectedOrder = orderBookDomain.getSelectedOrder()

  const [baseToken, quoteToken] = accountBalancesDomain.getBalancesAndAllowancesBySymbol([baseTokenSymbol, quoteTokenSymbol])
  const currentAddress = accountDomain.address()
  const baseTokenLockedBalance = orderDomain.lockedBalanceByToken(baseTokenSymbol, currentAddress)
  const quoteTokenLockedBalance = orderDomain.lockedBalanceByToken(quoteTokenSymbol, currentAddress)
  const baseTokenBalance = baseToken.balance - baseTokenLockedBalance
  const quoteTokenBalance = quoteToken.balance - quoteTokenLockedBalance
  const pairIsAllowed = baseToken.allowed && quoteToken.allowed
  const pairAllowanceIsPending = baseToken.allowancePending || quoteToken.allowancePending

  return {
    selectedOrder,
    currentPair,
    currentPairData,
    baseTokenSymbol,
    quoteTokenSymbol,
    baseTokenBalance,
    quoteTokenBalance,
    baseTokenDecimals,
    quoteTokenDecimals,
    makeFee,
    takeFee,
    pairIsAllowed,
    pairAllowanceIsPending,
  }
}

export const sendNewOrder = (side: Side, amount: number, price: number): ThunkAction => {
  return async (dispatch, getState, { socket }) => {
    try {
      const state = getState()
      const tokenPairsDomain = getTokenPairsDomain(state)
      const accountBalancesDomain = getAccountBalancesDomain(state)
      const accountDomain = getAccountDomain(state)

      const pair = tokenPairsDomain.getCurrentPair()
      const exchangeAddress = accountDomain.exchangeAddress()

      const {
        baseTokenSymbol,
        quoteTokenSymbol,
        baseTokenDecimals,
        quoteTokenDecimals,
        makeFee,
        takeFee,
      } = pair

      const signer = getSigner()
      const userAddress = await signer.getAddress()

      const params = {
        side,
        exchangeAddress,
        userAddress,
        pair,
        amount,
        price,
        makeFee,
        takeFee,
      }

      const pairMultiplier = utils.bigNumberify(10).pow(18 + baseTokenDecimals)
      const order = await signer.createRawOrder(params)
      let sellTokenSymbol, totalSellAmount
      const fee = max(makeFee, takeFee)

      order.side === 'BUY'
        ? (sellTokenSymbol = quoteTokenSymbol)
        : (sellTokenSymbol = baseTokenSymbol)

      const sellTokenBalance = accountBalancesDomain.getBigNumberBalance(sellTokenSymbol)
      const baseAmount = utils.bigNumberify(order.amount)
      const quoteAmount = (utils.bigNumberify(order.amount).mul(utils.bigNumberify(order.pricepoint))).div(pairMultiplier)
      const minQuoteAmount = minOrderAmount(makeFee, takeFee)
      const formattedMinQuoteAmount = utils.formatUnits(minQuoteAmount, quoteTokenDecimals)

      //In case the order is a sell, the fee is subtracted from the received amount of quote token so there is no requirement
      order.side === 'BUY'
        ? (totalSellAmount = quoteAmount.add(fee))
        : (totalSellAmount = baseAmount)

      if (quoteAmount.lt(minQuoteAmount)) {
        return dispatch(notifierActionCreators.addErrorNotification({ message: `Order value should be higher than ${formattedMinQuoteAmount} ${quoteTokenSymbol}` }))
      }

      if (sellTokenBalance.lt(totalSellAmount)) {
        return dispatch(notifierActionCreators.addErrorNotification({ message: `Insufficient ${sellTokenSymbol} balance` }))
      }

      console.log(order)
      socket.sendNewOrderMessage(order)

      // // update to swarm feed
      // const feedOrder = [
      //   {
      //     id: '0x5b8ba1e94971a5143fe0908e',
      //     amount: utils.bigNumberify(order.amount),
      //     baseToken: order.baseToken,
      //     filledAmount: utils.bigNumberify('0'),
      //     timestamp: Math.round(Date.now() / 1000),
      //     exchangeAddress: order.exchangeAddress,
      //     makeFee: utils.bigNumberify('0'),
      //     nonce: utils.bigNumberify(order.nonce),
      //     pairName: `${baseTokenSymbol}/${quoteTokenSymbol}`,
      //     pricepoint: utils.bigNumberify(order.pricepoint),
      //     quoteToken: order.quoteToken,
      //     side: order.side,
      //     status: order.status,
      //     takeFee: utils.bigNumberify(order.takeFee),
      //     userAddress: order.userAddress,
      //     hash: order.hash,
      //     signature: joinSignature(order.signature),
      //   },
      // ]
      //
      // const result = await signer.updateSwarmFeed(order.baseToken, feedOrder)
      // console.log("result", result)
      //
      // if (result) {
      //   return dispatch(notifierActionCreators.addSuccessNotification({ message: 'Order is updated successfully on decentralize storage' }))
      // }
    } catch (e) {
      console.log(e)
      const message = parseNewOrderError(e)
      return dispatch(notifierActionCreators.addErrorNotification({ message }))
    }
  }
}

export function unlockPair(baseTokenSymbol: string, quoteTokenSymbol: string): ThunkAction {
  return async (dispatch, getState, { txProvider }) => {

    try {
      const state = getState()
      const tokens = getTokenDomain(state).bySymbol()
      const baseTokenAddress = tokens[baseTokenSymbol].address
      const quoteTokenAddress = tokens[quoteTokenSymbol].address

      const txSentHandler = (txHash1, txHash2) => {
        const tx1 = { type: 'Token Unlocked', hash: txHash1, time: Date.now(), status: 'PENDING' }
        const tx2 = { type: 'Token Unlocked', hash: txHash2, time: Date.now(), status: 'PENDING' }

        dispatch(actionCreators.unlockPair(baseTokenSymbol, quoteTokenSymbol, tx1, tx2))
      }

      const txConfirmHandler = (txConfirmed, txHash1, txHash2) => {
        const tx1 = { type: 'Token Unlocked', hash: txHash1, time: Date.now(), status: 'CONFIRMED' }
        const tx2 = { type: 'Token Unlocked', hash: txHash2, time: Date.now(), status: 'CONFIRMED' }
        const errorMessage = `Approval failed. Please try again`

        txConfirmed
          ? dispatch(actionCreators.confirmUnlockPair(baseTokenSymbol, quoteTokenSymbol, tx1, tx2))
          : dispatch(actionCreators.errorUnlockPair(baseTokenSymbol, quoteTokenSymbol, tx1, tx2, errorMessage))
      }

      txProvider.updatePairAllowances(baseTokenAddress, quoteTokenAddress, txConfirmHandler, txSentHandler)
    } catch (e) {
      console.log(e)
      dispatch(notifierActionCreators.addErrorNotification({ message: e.message }))
    }
  }
}
