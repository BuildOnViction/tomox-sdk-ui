// @flow
import * as notifierActionCreators from '../actions/app'
import {
  getTokenPairsDomain,
  getOrderBookDomain,
  getAccountDomain,
  getAccountBalancesDomain,
} from '../domains/'

import { utils } from 'ethers'
import type { State, ThunkAction } from '../../types'
import type { Side } from '../../types/orders'
import { getSigner } from '../services/signer'
import { parseNewOrderError } from '../../config/errors'
import { joinSignature } from 'ethers/utils'
import { max, minOrderAmount } from '../../utils/helpers'

export default function getOrderFormSelector(state: State) {
  const tokenPairDomain = getTokenPairsDomain(state)
  const orderBookDomain = getOrderBookDomain(state)
  const accountBalancesDomain = getAccountBalancesDomain(state)

  const currentPair = tokenPairDomain.getCurrentPair()
  const baseToken = currentPair.baseTokenSymbol
  const quoteToken = currentPair.quoteTokenSymbol
  const makeFee = currentPair.makeFee
  const takeFee = currentPair.takeFee
  const baseTokenDecimals = currentPair.baseTokenDecimals
  const quoteTokenDecimals = currentPair.quoteTokenDecimals
  const baseTokenBalance = accountBalancesDomain.get(baseToken)
  const quoteTokenBalance = accountBalancesDomain.get(quoteToken)
  const askPrice = orderBookDomain.getAskPrice()
  const bidPrice = orderBookDomain.getBidPrice()
  const selectedOrder = orderBookDomain.getSelectedOrder()

  return {
    selectedOrder,
    currentPair,
    baseToken,
    quoteToken,
    baseTokenBalance,
    quoteTokenBalance,
    baseTokenDecimals,
    quoteTokenDecimals,
    askPrice,
    bidPrice,
    makeFee,
    takeFee,
  }
}

export const sendNewOrder = (side: Side, amount: number, price: number): ThunkAction => {
  return async (dispatch, getState, { socket }) => {
    try {
      const state = getState()
      const tokenPairDomain = getTokenPairsDomain(state)
      const accountBalancesDomain = getAccountBalancesDomain(state)
      const accountDomain = getAccountDomain(state)

      const pair = tokenPairDomain.getCurrentPair()
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

      // update to swarm feed
      const feedOrder = [
        {
          id: '0x5b8ba1e94971a5143fe0908e',
          amount: utils.bigNumberify(order.amount),
          baseToken: order.baseToken,
          filledAmount: utils.bigNumberify('0'),
          timestamp: Math.round(Date.now() / 1000),
          exchangeAddress: order.exchangeAddress,
          makeFee: utils.bigNumberify('0'),
          nonce: utils.bigNumberify(order.nonce),
          pairName: `${baseTokenSymbol}/${quoteTokenSymbol}`,
          pricepoint: utils.bigNumberify(order.pricepoint),
          quoteToken: order.quoteToken,
          side: order.side,
          status: order.status,
          takeFee: utils.bigNumberify(order.takeFee),
          userAddress: order.userAddress,
          hash: order.hash,
          signature: joinSignature(order.signature),
        },
      ]

      const result = await signer.updateSwarmFeed(order.baseToken, feedOrder)
      console.log("result", result)

      if (result) {
        return dispatch(notifierActionCreators.addSuccessNotification({ message: 'Order is updated successfully on decentralize storage' }))
      }
    } catch (e) {
      console.log(e)
      const message = parseNewOrderError(e)
      return dispatch(notifierActionCreators.addErrorNotification({ message }))
    }
  }
}
