//@flow

import {
  getAccountDomain,
  getAccountBalancesDomain,
  getTokenDomain,
  getSettingsDomain,
  getTokenPairsDomain,
} from '../domains'

import { quoteTokens } from '../../config/quotes'
import { NATIVE_TOKEN_SYMBOL } from '../../config/tokens'

import * as actionCreators from '../actions/walletPage'
import * as notifierActionCreators from '../actions/app'
import * as settingsActionCreators from '../actions/settings'
// import * as accountActionTypes from "../actions/account"

// import { getCurrentBlock } from "../services/wallet"
import type { State, ThunkAction } from '../../types'
import type { Token } from '../../types/tokens'

export default function createSelector(state: State) {
  const accountDomain = getAccountDomain(state)
  const accountBalancesDomain = getAccountBalancesDomain(state)
  const settingsDomain = getSettingsDomain(state)
  const tokenPairs = getTokenPairsDomain(state)

  const TomoBalance = accountBalancesDomain.tomoBalance()
  const authenticated = accountDomain.authenticated()
  const address = accountDomain.address()
  const currentBlock = accountDomain.currentBlock()
  const accountLoading = !TomoBalance
  const referenceCurrency = accountDomain.referenceCurrency()
  const locale = settingsDomain.getLocale()
  const currentPair = tokenPairs.getCurrentPair()
  const currentPairData = tokenPairs.getCurrentPairData()
  const { router: { location: { pathname }}} = state

  return {
    TomoBalance,
    authenticated,
    address,
    accountLoading,
    currentBlock,
    locale,
    currentPair,
    currentPairData,
    pathname,
    referenceCurrency,
  }
}

export function queryAppData(): ThunkAction {
  return async (dispatch, getState, { api }) => {
    const state = getState()
    const { router: { location: { pathname }}} = state
    const pairParam = pathname.match(/.*trade\/?(.*)$/)
    let currentPair = pairParam ? pairParam[1].replace('-', '/') : ''

    try {
      let tokens = getTokenDomain(state).tokens()
      const quotes = quoteTokens

      tokens = quotes
        .concat(tokens)
        .filter((token: Token) => token.symbol !== NATIVE_TOKEN_SYMBOL)

      // const currentBlock = await getCurrentBlock()
      // if (!currentBlock) throw new Error("")

      const pairs = await api.fetchPairs()
      const tokenPairData = await api.fetchTokenPairData()
      
      const availablePairs = tokenPairData.map(pairData => pairData.pair.pairName)
      currentPair = availablePairs.includes(currentPair) ? currentPair : availablePairs[0]

      dispatch(actionCreators.updateCurrentPair(currentPair))
      // dispatch(accountActionTypes.updateCurrentBlock(currentBlock))
      dispatch(actionCreators.updateTokenPairs(pairs))
    } catch (e) {
      dispatch(
        notifierActionCreators.addErrorNotification({
          message: "Could not connect to Tomochain network"
        })
      )
      console.log(e)
    }
  }
}

export function queryAccountData(): ThunkAction {
  return async (dispatch, getState, { api }) => {
    const state = getState()
    const accountAddress = getAccountDomain(state).address()

    try {
      let tokens = getTokenDomain(state).tokens()
      const quotes = quoteTokens

      tokens = quotes
        .concat(tokens)
        .filter((token: Token) => token.symbol !== NATIVE_TOKEN_SYMBOL)
      if (!accountAddress) throw new Error('Account address is not set')

      // const tomoBalance: TokenBalance = await accountBalancesService.queryTomoBalance(
      //   accountAddress
      // )
      const tomoBalance: TokenBalance = await api.fetchTomoBalance(accountAddress)
      // const tokenBalances: TokenBalances = await accountBalancesService.queryTokenBalances(
      //   accountAddress,
      //   tokens
      // )
      const tokenBalances: TokenBalances = await api.fetchTokenBalances(accountAddress, tokens)
      // const allowances = await accountBalancesService.queryExchangeTokenAllowances(
      //   accountAddress,
      //   tokens
      // )
      const balances = [tomoBalance].concat(tokenBalances)

      dispatch(actionCreators.updateBalances(balances))
      // dispatch(actionCreators.updateAllowances(allowances))

      // await accountBalancesService.subscribeTokenBalances(
      //   accountAddress,
      //   tokens,
      //   balance => dispatch(actionCreators.updateBalance(balance))
      // )

    } catch (e) {
      dispatch(
        notifierActionCreators.addErrorNotification({
          message: 'Could not connect to Tomochain network',
        })
      )
      console.log(e)
    }
  }
}

export function createProvider(): ThunkAction {
  return async (dispatch, getState, { provider }) => {
    provider.createConnection()
  }
}

export function changeLocale(locale: string): ThunkAction {
  return async (dispatch, getstate) => {
    dispatch(settingsActionCreators.changeLocale(locale))
  }
}
