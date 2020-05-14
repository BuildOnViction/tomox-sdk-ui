// @flow
import { push } from 'connected-react-router'

import {
  getTokenPairsDomain,
  getAccountDomain,
  getConnectionDomain,
  getOhlcvDomain,
  getTokenDomain,
  getLendingPairsDomain,
} from '../../domains'

import * as lendingActionCreators from '../../actions/lending/lendingTradePage'
import * as lendingOrdersActionCreators from '../../actions/lending/lendingOrders'
import * as lendingTradesActionCreators from '../../actions/lending/lendingTrades'
import * as notifierActionCreators from '../../actions/app'

import type { State, ThunkAction } from '../../types'
import {
  parseLendingOrders,
  parseLendingTradesByAddress,
} from '../../../utils/parsers'

// eslint-disable-next-line
export default function tradingPageSelector(state: State) {
  const accountDomain = getAccountDomain(state)
  const pairsDomain = getLendingPairsDomain(state)
  const ohlcvData = getOhlcvDomain(state).getOHLCVData()
  const { isInitiated, isConnected } = getConnectionDomain(state)
  const currentPair = pairsDomain.getCurrentPair()
  const authenticated = accountDomain.authenticated()

  return {
    currentPairName: currentPair ? currentPair.pair : '',
    authenticated,
    isConnected,
    isInitiated,
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
      const tokens = getTokenDomain(state).byAddress()
      const lendingPairsDomain = getLendingPairsDomain(state)
      const lendingPairs = lendingPairsDomain.getPairs()
      const currentPair = lendingPairsDomain.getCurrentPair()
      const pairName = pair ? pair.replace('_', ' ').replace('-', '/') : currentPair.pair

      let { router: { location: { pathname }}} = state
      pathname = pathname.includes('dapp') ? 'dapp/lending' : 'lending'   
         
      if (!pair && pairName) dispatch(push(`/${pathname}/${pairName.replace(' ', '_').replace('/', '-')}`))
      
      //TODO: need to check pairName exist or not
      if (!currentPair.pair) return

      if (pairName.toLowerCase() !== currentPair.pair.toLowerCase()) {
        const pair = lendingPairs.find(lendingPair => lendingPair.pair === pairName)
        return dispatch(lendingActionCreators.updateCurrentPair(pair || {}))
      }

      const accountDomain = getAccountDomain(state)
      const authenticated = accountDomain.authenticated()

      if (authenticated) {
        const pairs = getTokenPairsDomain(state).getPairsArray()
        const userAddress = accountDomain.address()
        const exchangeAddress = accountDomain.exchangeAddress()

        const [
          ordersResult,
          tradesByAddressResult,
        ] = await Promise.all([
          api.fetchLendingOrders(userAddress),
          api.fetchLendingAddressTrades(userAddress), 
        ])

        const orders = parseLendingOrders(ordersResult.lendings, tokens)
        const tradesByAddress = parseLendingTradesByAddress(userAddress, exchangeAddress, tradesByAddressResult.trades, pairs)

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

export const queryDappTradePageData = (pair): ThunkAction => {
  return async (dispatch, getState, { api, socket }) => {
    try {
      const addresses = JSON.parse(sessionStorage.getItem('addresses'))
      if (!addresses) throw new Error('Cannot get tokens or pairs')


      // Unsubscribe socket when change current pair
      socket.unSubscribeLendingPrice()
      socket.unsubscribeLendingOrderBook()
      socket.unsubscribeLendingTrades()      

      const state = getState()
      const tokens = getTokenDomain(state).byAddress()
      const lendingPairsDomain = getLendingPairsDomain(state)
      const currentPair = lendingPairsDomain.getCurrentPair()
      const pairName = pair ? pair.replace('_', ' ').replace('-', '/') : currentPair.pair

      // let { router: { location: { pathname }}} = state
      // pathname = pathname.includes('dapp') ? 'dapp/lending' : 'lending'   
         
      // if (!pair && pairName) dispatch(push(`/${pathname}/${pairName.replace(' ', '_').replace('/', '-')}`))

      //TODO: need to check pairName exist or not
      if (!currentPair.pair) return

      if (pairName.toLowerCase() !== currentPair.pair.toLowerCase()) {
        return dispatch(lendingActionCreators.updateCurrentPair(pairName))
      }

      const accountDomain = getAccountDomain(state)
      const authenticated = accountDomain.authenticated()

      if (authenticated) {
        const pairs = getTokenPairsDomain(state).getPairsArray()
        const userAddress = accountDomain.address()
        const exchangeAddress = accountDomain.exchangeAddress()

        const [
          ordersResult,
          tradesByAddressResult,
        ] = await Promise.all([
          api.fetchLendingOrders(userAddress),
          api.fetchLendingAddressTrades(userAddress), 
        ])

        const orders = parseLendingOrders(ordersResult.lendings, tokens)
        const tradesByAddress = parseLendingTradesByAddress(userAddress, exchangeAddress, tradesByAddressResult.trades, pairs)

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
