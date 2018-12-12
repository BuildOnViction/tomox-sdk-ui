// @flow
import {
  getTokenPairsDomain,
  getAccountDomain,
  getAccountBalancesDomain,
  getConnectionDomain,
} from '../domains'
import * as actionCreators from '../actions/tradingPage'
import type { State, ThunkAction } from '../../types'
import { getSigner } from '../services/signer'
import {
  // parseTrades,
  parseOrders,
  parseTokenPairData,
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
  const baseTokenAllowance = accountBalancesDomain.tokenAllowance(baseTokenSymbol)
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

export const getDefaultData = (): ThunkAction => {
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
      // let pairs = pairDomain.getPairsByCode();

      const { baseTokenDecimals, quoteTokenDecimals } = currentPair

      let tokenPairData = await api.fetchTokenPairData()

      console.log('TOKEN PAIR DATA', tokenPairData)
      console.log('DECIMALS', baseTokenDecimals, quoteTokenDecimals)

      tokenPairData = parseTokenPairData(tokenPairData, baseTokenDecimals)

      let orders = await api.fetchOrders(userAddress)
      // console.log(orders, currentPair)
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
