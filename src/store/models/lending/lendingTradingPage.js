// @flow
// import { push, useParams } from 'connected-react-router'

import {
  getTokenPairsDomain,
  getAccountDomain,
  // getAccountBalancesDomain,
  getConnectionDomain,
  getOhlcvDomain,
  getLendingPairsDomain,
} from '../../domains'

// import * as actionCreators from '../../actions/tradingPage'
import * as lendingActionCreators from '../../actions/lending/lendingTradePage'
import * as lendingOrdersActionCreators from '../../actions/lending/lendingOrders'
import * as lendingTradesActionCreators from '../../actions/lending/lendingTrades'
import * as notifierActionCreators from '../../actions/app'

import type { State, ThunkAction } from '../../types'
import {
  parseLendingOrders,
  parseLendingTradesByAddress,
  parseTradesByAddress,
  parseOrders,
} from '../../../utils/parsers'

// eslint-disable-next-line
export default function tradingPageSelector(state: State) {
  const accountDomain = getAccountDomain(state)
  // const accountBalancesDomain = getAccountBalancesDomain(state)
  const pairsDomain = getLendingPairsDomain(state)
  const ohlcvData = getOhlcvDomain(state).getOHLCVData()
  const { isInitiated, isConnected } = getConnectionDomain(state)
  const {
    pair,
    // makeFee,
    // takeFee,
    // baseTokenSymbol,
    // quoteTokenSymbol,
  } = pairsDomain.getCurrentPair()

  const authenticated = accountDomain.authenticated()
  // const baseTokenBalance = accountBalancesDomain.tokenBalance(baseTokenSymbol)
  // const quoteTokenBalance = accountBalancesDomain.tokenBalance(quoteTokenSymbol)

  return {
    currentPairName: pair,
    // makeFee,
    // takeFee,
    authenticated,
    // baseTokenBalance,
    // baseTokenSymbol,
    isConnected,
    isInitiated,
    // quoteTokenBalance,
    // quoteTokenSymbol,
    ohlcvData,
  }
}

export const queryTradingPageData = (pair): ThunkAction => {
  return async (dispatch, getState, { api, socket }) => {
    try {
      const addresses = JSON.parse(sessionStorage.getItem('addresses'))
      if (!addresses) throw new Error('Cannot get tokens or pairs')


      // Unsubscribe socket when change current pair
      socket.unSubscribeLendingPrice()
      socket.unsubscribeLendingOrderBook()
      socket.unsubscribeLendingTrades()      

      const state = getState()
      const lendingPairsDomain = getLendingPairsDomain(state)
      const currentPair = lendingPairsDomain.getCurrentPair()
      const pairName = pair.replace('_', ' ').replace('-', '/')

      //TODO: need to check pairName exist or not
      if (!currentPair.pair || pairName.toLowerCase() !== currentPair.pair.toLowerCase()) {
        return dispatch(lendingActionCreators.updateCurrentPair(pairName))
      }

      const accountDomain = getAccountDomain(state)
      const authenticated = accountDomain.authenticated()

      if (authenticated) {
        const pairs = getTokenPairsDomain(state).getPairsArray()
        const userAddress = accountDomain.address()

        const [
          ordersResult,
          tradesByAddressResult,
        ] = await Promise.all([
          api.fetchLendingOrders(userAddress),
          api.fetchLendingAddressTrades(userAddress), 
        ])

        const orders = parseLendingOrders(ordersResult.lendings)
        const tradesByAddress = parseLendingTradesByAddress(userAddress, tradesByAddressResult.trades, pairs)

        dispatch(lendingOrdersActionCreators.ordersInitialized(orders))
        dispatch(lendingTradesActionCreators.updateTradesByAddress(tradesByAddress))
      }

      const subscribeData = {
        term: Number(currentPair.termValue), 
        lendingToken: currentPair.lendingTokenAddress,
      }
      socket.subscribeLendingPrice(subscribeData)
      socket.subscribeLendingTrades(subscribeData)
      socket.subscribeLendingOrderBook(subscribeData)
      dispatch(lendingActionCreators.updateOHLCVLoading(false))
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

        let [
          orders,
          tradesByAddress, // For trade history in OrderTable
        ] = await Promise.all([
          api.fetchOrders(userAddress),
          api.fetchAddressTrades(userAddress), 
        ])

        orders = parseOrders(orders, pairs)
        tradesByAddress = parseTradesByAddress(userAddress, tradesByAddress, pairs)

        dispatch(lendingActionCreators.initOrdersTable(orders))
        dispatch(lendingActionCreators.updateTradesByAddress(tradesByAddress))
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

      dispatch(lendingActionCreators.updateCurrentPair(pair))
      const tokenPair = pairDomain.getPair(pair)

      socket.subscribePrice(tokenPair)
      socket.subscribeTrades(tokenPair)
      socket.subscribeOrderBook(tokenPair)
      dispatch(lendingActionCreators.updateOHLCVLoading(true))
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
