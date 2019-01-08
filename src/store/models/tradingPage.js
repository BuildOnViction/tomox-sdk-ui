// @flow
import {
  getTokenPairsDomain,
  getAccountDomain,
  getTokenDomain,
  getAccountBalancesDomain,
  getConnectionDomain,
} from '../domains'

import * as actionCreators from '../actions/tradingPage'
import * as notifierActionCreators from '../actions/app'

import type { State, ThunkAction } from '../../types'
import { getSigner } from '../services/signer'
import {
  // parseTrades,
  parseOrders,
  parseTokenPairsData,
} from '../../utils/parsers'

// eslint-disable-next-line
export default function tradingPageSelector(state: State) {
  const accountDomain = getAccountDomain(state)
  const accountBalancesDomain = getAccountBalancesDomain(state)
  const pairDomain = getTokenPairsDomain(state)
  const { isInitiated, isConnected } = getConnectionDomain(state)
  const {
    makeFee,
    takeFee,
    baseTokenSymbol,
    quoteTokenSymbol,
  } = pairDomain.getCurrentPair()

  const authenticated = accountDomain.authenticated()
  const baseTokenBalance = accountBalancesDomain.tokenBalance(baseTokenSymbol)
  const quoteTokenBalance = accountBalancesDomain.tokenBalance(quoteTokenSymbol)
  const baseTokenAllowance = accountBalancesDomain.tokenAllowance(
    baseTokenSymbol
  )
  const quoteTokenAllowance = accountBalancesDomain.tokenAllowance(
    quoteTokenSymbol
  )

  return {
    makeFee,
    takeFee,
    authenticated,
    baseTokenAllowance,
    baseTokenBalance,
    baseTokenSymbol,
    isConnected,
    isInitiated,
    quoteTokenAllowance,
    quoteTokenBalance,
    quoteTokenSymbol,
  }
}

export const queryTradingPageData = (): ThunkAction => {
  return async (dispatch, getState, { api, socket }) => {
    try {
      socket.unsubscribeChart()
      socket.unsubscribeOrderBook()
      socket.unsubscribeTrades()

      const state = getState()
      const signer = getSigner()
      const pairDomain = getTokenPairsDomain(state)

      const userAddress = await signer.getAddress()
      const currentPair = pairDomain.getCurrentPair()
      const pairs = pairDomain.getPairsByCode()

      const { baseTokenDecimals } = currentPair

      let tokenPairData = await api.fetchTokenPairData()

      tokenPairData = parseTokenPairsData(tokenPairData, pairs)

      let orders = await api.fetchOrders(userAddress)
      orders = parseOrders(orders, baseTokenDecimals)

      dispatch(actionCreators.updateTokenPairData(tokenPairData))
      dispatch(actionCreators.initOrdersTable(orders))

      socket.subscribeTrades(currentPair)
      socket.subscribeOrderBook(currentPair)
      socket.subscribeChart(
        currentPair,
        state.ohlcv.currentTimeSpan.label,
        state.ohlcv.currentDuration.label
      )
    } catch (e) {
      console.log(e)
    }
  }
}

export function toggleAllowances(baseTokenSymbol: string, quoteTokenSymbol: string): ThunkAction {
  return async (dispatch, getState, { txProvider }) => {
    try {
      const state = getState()
      const tokens = getTokenDomain(state).bySymbol()
      const baseTokenAddress = tokens[baseTokenSymbol].address
      const quoteTokenAddress = tokens[quoteTokenSymbol].address

      const txConfirmHandler = (txConfirmed) => {
        txConfirmed
          ? dispatch(notifierActionCreators.addSuccessNotification({ message: `Approval Successful. You can now start trading!` }))
          : dispatch(notifierActionCreators.addErrorNotification({ message: `Approval Failed. Please try again.` }))
      }

      txProvider.updatePairAllowances(baseTokenAddress, quoteTokenAddress, txConfirmHandler)
      dispatch(notifierActionCreators.addSuccessNotification({ message: `Unlocking ${baseTokenSymbol}/${quoteTokenSymbol} trading. Your transaction should be approved within a few minutes` }))

    } catch (e) {
      console.log(e)
      dispatch(notifierActionCreators.addErrorNotification({ message: e.message }))
    }
  }
}

// eslint-disable-next-line
export const updateCurrentPair = (pair: string): ThunkAction => {
  return async (dispatch, getState, { api, socket }) => {
    try {
      socket.unsubscribeChart()
      socket.unsubscribeOrderBook()
      socket.unsubscribeTrades()

      const state = getState()
      const pairDomain = getTokenPairsDomain(state)

      dispatch(actionCreators.updateCurrentPair(pair))
      const tokenPair = pairDomain.getPair(pair)

      socket.subscribeTrades(tokenPair)
      socket.subscribeOrderBook(tokenPair)
      socket.subscribeChart(
        tokenPair,
        state.ohlcv.currentTimeSpan.label,
        state.ohlcv.currentDuration.label
      )
    } catch (e) {
      console.log(e)
    }
  }
}
