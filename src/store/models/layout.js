//@flow

import {
  getAccountDomain,
  getAccountBalancesDomain,
  getTokenDomain,
  getSettingsDomain,
} from '../domains'

import { quoteTokens } from '../../config/quotes'

import * as accountBalancesService from '../services/accountBalances'
import * as actionCreators from '../actions/walletPage'
import * as notifierActionCreators from '../actions/app'
import * as settingsActionCreators from '../actions/settings'

import type { State, ThunkAction } from '../../types'
import type { Token, TokenBalance, TokenBalances } from '../../types/tokens'

export default function createSelector(state: State) {
  const accountDomain = getAccountDomain(state)
  const accountBalancesDomain = getAccountBalancesDomain(state)
  const settingsDomain = getSettingsDomain(state)

  const ETHBalance = accountBalancesDomain.etherBalance()
  const WETHBalance = accountBalancesDomain.tokenBalance('WETH')
  const WETHAllowance = accountBalancesDomain.tokenAllowance('WETH')
  const authenticated = accountDomain.authenticated()
  const address = accountDomain.address()
  const currentBlock = accountDomain.currentBlock()
  const accountLoading = !(ETHBalance && WETHBalance && WETHAllowance)
  const locale = settingsDomain.getLocale()

  return {
    ETHBalance,
    WETHBalance,
    WETHAllowance,
    authenticated,
    address,
    accountLoading,
    currentBlock,
    locale,
  }
}

export function queryAccountData(): ThunkAction {
  return async (dispatch, getState) => {
    const state = getState()
    const accountAddress = getAccountDomain(state).address()

    try {
      let tokens = getTokenDomain(state).tokens()
      const quotes = quoteTokens

      tokens = quotes
        .concat(tokens)
        .filter((token: Token) => token.symbol !== 'ETH')
      if (!accountAddress) throw new Error('Account address is not set')

      const etherBalance: TokenBalance = await accountBalancesService.queryEtherBalance(
        accountAddress
      )
      const tokenBalances: TokenBalances = await accountBalancesService.queryTokenBalances(
        accountAddress,
        tokens
      )
      const allowances = await accountBalancesService.queryExchangeTokenAllowances(
        accountAddress,
        tokens
      )
      const balances = [etherBalance].concat(tokenBalances)

      dispatch(actionCreators.updateBalances(balances))
      dispatch(actionCreators.updateAllowances(allowances))

      await accountBalancesService.subscribeTokenBalances(
        accountAddress,
        tokens,
        balance => dispatch(actionCreators.updateBalance(balance))
      )

      await accountBalancesService.subscribeEtherBalance(
        accountAddress,
        balance =>
          dispatch(
            actionCreators.updateBalance({
              symbol: 'ETH',
              balance,
            })
          )
      )

      await accountBalancesService.subscribeTokenAllowances(
        accountAddress,
        tokens,
        allowance => {
          return dispatch(actionCreators.updateAllowance(allowance))
        }
      )
    } catch (e) {
      dispatch(
        notifierActionCreators.addErrorNotification({
          message: 'Could not connect to Ethereum network',
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
