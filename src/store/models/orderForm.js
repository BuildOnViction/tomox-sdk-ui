// @flow
import * as notifierActionCreators from '../actions/app'
import * as ordersActionCreators from '../actions/orders'
import * as orderActionsCreators from '../actions/orders'

import {
  getTokenPairsDomain,
  getOrderBookDomain,
  getAccountBalancesDomain,
  getAccountDomain,
  getOrdersDomain,
} from '../domains/'

import type { State, ThunkAction } from '../../types'
import type { Side, OrderType } from '../../types/orders'
import { getSigner } from '../services/signer'
import { parseNewOrderError } from '../../config/errors'
import { push } from 'connected-react-router'
import { BigNumber } from 'bignumber.js'

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
    baseTokenDecimals,
    quoteTokenDecimals,
  } = currentPair

  const selectedOrder = orderBookDomain.getSelectedOrder()

  const [baseToken, quoteToken] = accountBalancesDomain.getBalancesAndAllowancesBySymbol([baseTokenSymbol, quoteTokenSymbol])
  const authenticated = accountDomain.authenticated()
  const loading = orderDomain.loading()
  const baseTokenBalance = baseToken.availableBalance || 0
  const quoteTokenBalance = quoteToken.availableBalance || 0
  const fee = accountDomain.fee()

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
    authenticated,
    loading,
    fee,
  }
}

export const sendNewOrder = (side: Side, type: OrderType,amount: number, price: number): ThunkAction => {
  return async (dispatch, getState, { socket, api }) => {
    try {
      dispatch(ordersActionCreators.ordersUpdatedStatus(true))

      const state = getState()
      const tokenPairsDomain = getTokenPairsDomain(state)
      const accountBalancesDomain = getAccountBalancesDomain(state)
      const accountDomain = getAccountDomain(state)
      const pair = tokenPairsDomain.getCurrentPair()
      const exchangeAddress = accountDomain.exchangeAddress()
      const fee = accountDomain.fee()

      const {
        baseTokenSymbol,
        quoteTokenSymbol,
        baseTokenDecimals,
      } = pair

      const signer = getSigner()
      const userAddress = await signer.getAddress()
      const orderNonce = await api.getOrderNonceByAddress(userAddress)

      const params = {
        side,
        type,
        status: 'NEW',
        exchangeAddress,
        userAddress,
        pair,
        amount,
        price,
        orderNonce,
      }

      const pairMultiplier = Math.pow(10, baseTokenDecimals)
      const order = await signer.createRawOrder(params)
      let sellTokenSymbol, totalSellAmount

      order.side === 'BUY'
        ? (sellTokenSymbol = quoteTokenSymbol)
        : (sellTokenSymbol = baseTokenSymbol)

      const sellTokenBalance = accountBalancesDomain.getBigNumberBalance(sellTokenSymbol)
      const baseAmount = BigNumber(order.amount)
      // order.amount = amount * Math.pow(10, baseDecimals)
      // order.pricepoint = price * Math.pow(10, quoteDecimals)
      // quoteAmount = order.amount * order.pricepoint / Math.pow(10, baseTokenDecimls)
      const quoteAmount = BigNumber(order.amount).times(order.pricepoint).div(pairMultiplier)

      //In case the order is a sell, the fee is subtracted from the received amount of quote token so there is no requirement
      order.side === 'BUY'
        ? (totalSellAmount = quoteAmount.plus(quoteAmount.times(fee)))
        : (totalSellAmount = baseAmount)

      if (sellTokenBalance.lt(totalSellAmount)) {
        dispatch(orderActionsCreators.ordersUpdatedStatus(false))
        return dispatch(notifierActionCreators.addErrorNotification({ message: `Insufficient ${sellTokenSymbol} balance` }))
      }
      
      socket.sendNewOrderMessage(order)
    } catch (e) {
      console.log(e)
      dispatch(ordersActionCreators.ordersUpdatedStatus(false))
      const message = parseNewOrderError(e)
      return dispatch(notifierActionCreators.addErrorNotification({ message }))
    }
  }
}

export const redirectToLoginPage = (): ThunkAction => {
  return async (dispatch, getState) => {
    dispatch(push('/unlock'))
  }
}
