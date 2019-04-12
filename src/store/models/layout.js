//@flow

import {
  getAccountDomain,
  getAccountBalancesDomain,
  getTokenDomain,
  getSettingsDomain,
  getTokenPairsDomain
} from '../domains'

import { quoteTokens } from '../../config/quotes'
import { NATIVE_TOKEN_SYMBOL } from '../../config/tokens'

// import * as accountBalancesService from '../services/accountBalances'
import * as actionCreators from '../actions/walletPage'
import * as notifierActionCreators from '../actions/app'
import * as settingsActionCreators from '../actions/settings'

import type { State, ThunkAction } from '../../types'
import type { Token, TokenBalance, TokenBalances } from '../../types/tokens'

export default function createSelector(state: State) {
  const accountDomain = getAccountDomain(state)
  const accountBalancesDomain = getAccountBalancesDomain(state)
  const settingsDomain = getSettingsDomain(state)
  const tokenPairs = getTokenPairsDomain(state)

  const TomoBalance = accountBalancesDomain.tomoBalance()
  const WETHBalance = accountBalancesDomain.tokenBalance('WETH')
  const WETHAllowance = accountBalancesDomain.tokenAllowance('WETH')
  const authenticated = accountDomain.authenticated()
  const address = accountDomain.address()
  const currentBlock = accountDomain.currentBlock()
  const accountLoading = !(TomoBalance && WETHBalance && WETHAllowance)
  const referenceCurrency = accountDomain.referenceCurrency
  const locale = settingsDomain.getLocale()
  const currentPair = tokenPairs.getCurrentPair()
  const currentPairData = tokenPairs.getCurrentPairData()
  const { router: { location: { pathname }}} = state

  return {
    TomoBalance,
    WETHBalance,
    WETHAllowance,
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

      // await accountBalancesService.subscribeTomoBalance(
      //   accountAddress,
      //   balance =>
      //     dispatch(
      //       actionCreators.updateBalance({
      //         symbol: NATIVE_TOKEN_SYMBOL,
      //         balance,
      //       })
      //     )
      // )

      // await accountBalancesService.subscribeTokenAllowances(
      //   accountAddress,
      //   tokens,
      //   allowance => {
      //     return dispatch(actionCreators.updateAllowance(allowance))
      //   }
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
