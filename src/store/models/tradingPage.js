// @flow
import { push } from 'connected-react-router'

import {
  getTokenPairsDomain,
  getAccountDomain,
  getTokenDomain,
  getAccountBalancesDomain,
  getConnectionDomain,
  getOhlcvDomain,
} from '../domains'

import * as actionCreators from '../actions/tradingPage'
import * as notifierActionCreators from '../actions/app'

import type { State, ThunkAction } from '../../types'
import {
  parseTradesByAddress,
  parseOrders,
} from '../../utils/parsers'

// eslint-disable-next-line
export default function tradingPageSelector(state: State) {
  const accountDomain = getAccountDomain(state)
  const accountBalancesDomain = getAccountBalancesDomain(state)
  const pairDomain = getTokenPairsDomain(state)
  const ohlcvData = getOhlcvDomain(state).getOHLCVData()
  const { isInitiated, isConnected } = getConnectionDomain(state)
  const {
    pair,
    makeFee,
    takeFee,
    baseTokenSymbol,
    quoteTokenSymbol,
  } = pairDomain.getCurrentPair()

  const authenticated = accountDomain.authenticated()
  const baseTokenBalance = accountBalancesDomain.tokenBalance(baseTokenSymbol)
  const quoteTokenBalance = accountBalancesDomain.tokenBalance(quoteTokenSymbol)

  return {
    currentPairName: pair,
    makeFee,
    takeFee,
    authenticated,
    baseTokenBalance,
    baseTokenSymbol,
    isConnected,
    isInitiated,
    quoteTokenBalance,
    quoteTokenSymbol,
    ohlcvData,
  }
}

export const queryTradingPageData = (): ThunkAction => {
  return async (dispatch, getState, { api, socket }) => {
    try {
      const addresses = JSON.parse(sessionStorage.getItem('addresses'))
      if (!addresses) throw new Error('Cannot get tokens or pairs')

      // Unsubscribe socket when change current pair
      socket.unSubscribePrice()
      socket.unsubscribeOrderBook()
      socket.unsubscribeTrades()      

      const state = getState()
      const pairDomain = getTokenPairsDomain(state)
      const currentPair = pairDomain.getCurrentPair()

      let { router: { location: { pathname }}} = state
      const pairParam = pathname.match(/.*\/(trade|dapp)\/?(.*)$/i)
      let pairName = (pairParam && pairParam[2]) ? pairParam[2].toUpperCase() : (currentPair.pair ? currentPair.pair : '')

      pathname = pathname.includes('dapp') ? 'dapp' : 'trade'
      dispatch(push(`/${pathname}/${pairName.replace('/', '-')}`))

      const pairs = pairDomain.getPairsArray()
      const accountDomain = getAccountDomain(state)
      const authenticated = accountDomain.authenticated()

      if (authenticated) {
        const userAddress = accountDomain.address()
        const exchangeAddress = accountDomain.exchangeAddress()

        let [
          orders,
          tradesByAddress, // For trade history in OrderTable
        ] = await Promise.all([
          api.fetchOrders(userAddress),
          api.fetchAddressTrades(userAddress), 
        ])

        orders = parseOrders(orders, pairs)
        tradesByAddress = parseTradesByAddress(userAddress, exchangeAddress, tradesByAddress, pairs)

        dispatch(actionCreators.initOrdersTable(orders))
        dispatch(actionCreators.updateTradesByAddress(tradesByAddress))
      }

      socket.subscribePrice(currentPair)
      socket.subscribeTrades(currentPair)
      socket.subscribeOrderBook(currentPair)
    } catch (e) {
      console.log(e)
      dispatch(notifierActionCreators.addErrorNotification({ message: e.message }))
    }
  }
}

export const queryDappTradePageData = (): ThunkAction => {
  return async (dispatch, getState, { api, socket }) => {
    try {
      const addresses = JSON.parse(sessionStorage.getItem('addresses'))
      if (!addresses) throw new Error('Cannot get tokens or pairs')

      // Unsubscribe socket when change current pair
      socket.unSubscribePrice()
      socket.unsubscribeOrderBook()
      socket.unsubscribeTrades()      

      const state = getState()
      const pairDomain = getTokenPairsDomain(state)
      const currentPair = pairDomain.getCurrentPair()

      const pairs = pairDomain.getPairsByCode()
      const accountDomain = getAccountDomain(state)
      const authenticated = accountDomain.authenticated()

      if (authenticated) {
        const userAddress = accountDomain.address()
        const exchangeAddress = accountDomain.exchangeAddress()

        let [
          orders,
          tradesByAddress, // For trade history in OrderTable
        ] = await Promise.all([
          api.fetchOrders(userAddress),
          api.fetchAddressTrades(userAddress), 
        ])

        orders = parseOrders(orders, pairs)
        tradesByAddress = parseTradesByAddress(userAddress, exchangeAddress, tradesByAddress, pairs)

        dispatch(actionCreators.initOrdersTable(orders))
        dispatch(actionCreators.updateTradesByAddress(tradesByAddress))
      }

      socket.subscribePrice(currentPair)
      socket.subscribeTrades(currentPair)
      socket.subscribeOrderBook(currentPair)
    } catch (e) {
      console.log(e)
      dispatch(notifierActionCreators.addErrorNotification({ message: e.message }))
    }
  }
}

export const releaseResources = (): ThunkAction => {
  return async (dispatch, getState, { api, socket }) => {
    try {
      socket.unsubscribeChart()
      socket.unsubscribeOrderBook()
      socket.unsubscribeTrades()
      socket.unSubscribePrice()
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
      socket.unSubscribePrice()

      const state = getState()
      const pairDomain = getTokenPairsDomain(state)

      dispatch(actionCreators.updateCurrentPair(pair))
      const tokenPair = pairDomain.getPair(pair)

      socket.subscribePrice(tokenPair)
      socket.subscribeTrades(tokenPair)
      socket.subscribeOrderBook(tokenPair)
      dispatch(actionCreators.updateOHLCVLoading(true))
      socket.subscribeChart(
        tokenPair,
        state.ohlcv.currentTimeSpan.label,
        state.ohlcv.currentDuration.label,
      )
    } catch (e) {
      console.log(e)
      dispatch(notifierActionCreators.addErrorNotification({ message: e.message }))
    }
  }
}
