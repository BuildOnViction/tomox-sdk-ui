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
import { getSigner } from '../services/signer'
import {
  parseTradesByAddress,
  parseOrders,
  parseTokenPairsData,
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
  const baseTokenAllowance = accountBalancesDomain.tokenAllowance(
    baseTokenSymbol,
  )
  const quoteTokenAllowance = accountBalancesDomain.tokenAllowance(
    quoteTokenSymbol,
  )

  return {
    currentPairName: pair,
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
    ohlcvData,
  }
}

export const queryTradingPageData = (): ThunkAction => {
  return async (dispatch, getState, { api, socket }) => {
    try {
      socket.unsubscribeChart()
      socket.unsubscribeOrderBook()
      socket.unsubscribeTrades()
      socket.unSubscribePrice()

      const state = getState()
      const pairDomain = getTokenPairsDomain(state)
      const currentPair = pairDomain.getCurrentPair()
      dispatch(push(`/trade/${currentPair.pair.replace('/', '-')}`))

      const pairs = pairDomain.getPairsByCode()
      const accountDomain = getAccountDomain(state)
      const authenticated = accountDomain.authenticated()

      if (authenticated) {
        const signer = getSigner()
        const userAddress = await signer.getAddress()

        let [
          orders,
          tradesByAddress, // For trade history in OrderTable
        ] = await Promise.all([
          api.fetchOrders(userAddress),
          api.fetchAddressTrades(userAddress), 
        ])

        orders = parseOrders(orders, pairs)
        tradesByAddress = parseTradesByAddress(tradesByAddress, pairs)

        dispatch(actionCreators.initOrdersTable(orders))
        dispatch(actionCreators.updateTradesByAddress(tradesByAddress))
      }

      let tokenPairData = await api.fetchTokenPairData()
      tokenPairData = parseTokenPairsData(tokenPairData, pairs)
      dispatch(actionCreators.updateTokenPairData(tokenPairData))

      socket.subscribePrice(currentPair)
      socket.subscribeTrades(currentPair)
      socket.subscribeOrderBook(currentPair)
      socket.subscribeChart(
        currentPair,
        state.ohlcv.currentTimeSpan.label,
        state.ohlcv.currentDuration.label,
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
      socket.unSubscribePrice()

      const state = getState()
      const pairDomain = getTokenPairsDomain(state)

      dispatch(actionCreators.updateCurrentPair(pair))
      const tokenPair = pairDomain.getPair(pair)

      socket.subscribePrice(tokenPair)
      socket.subscribeTrades(tokenPair)
      socket.subscribeOrderBook(tokenPair)
      socket.subscribeChart(
        tokenPair,
        state.ohlcv.currentTimeSpan.label,
        state.ohlcv.currentDuration.label,
      )
    } catch (e) {
      console.log(e)
    }
  }
}
