// @flow
import {
  getAccountBalancesDomain,
  getAccountDomain,
  getTokenDomain,
  getTransferTokensFormDomain,
} from '../domains'

import * as actionCreators from '../actions/walletPage'
import * as notifierActionCreators from '../actions/app'
import * as accountActionTypes from '../actions/account'
import * as accountBalancesService from '../services/accountBalances'
import { quoteTokens, quoteTokenSymbols } from '../../config/quotes'
import { getCurrentBlock } from '../services/wallet'
import { push } from 'connected-react-router'
import type { State, ThunkAction } from '../../types'
import type { Token, TokenBalance, TokenBalances } from '../../types/tokens'
import { NATIVE_TOKEN_SYMBOL } from '../../config/tokens'
import { NATIVE_TOKEN_ADDRESS } from '../../config/tokens'

export default function walletPageSelector(state: State) {
  const accountBalancesDomain = getAccountBalancesDomain(state)
  const accountDomain = getAccountDomain(state)
  const tokenDomain = getTokenDomain(state)
  const transferTokensFormDomain = getTransferTokensFormDomain(state)

  // TOMO is not a token so we add it to the list to display in the deposit table
  const TOMO = {
    symbol: NATIVE_TOKEN_SYMBOL,
    address: NATIVE_TOKEN_ADDRESS,
  }
  const tokens = tokenDomain.tokens()
  const quoteTokens = quoteTokenSymbols
  const baseTokens = tokenDomain
    .symbols()
    .filter(symbol => quoteTokens.indexOf(symbol) !== -1)
  const tokenData = accountBalancesDomain.getBalancesAndAllowances(
    [TOMO].concat(tokens)
  )

  return {
    tomoBalance: accountBalancesDomain.formattedTomoBalance(),
    balancesLoading: accountBalancesDomain.loading(),
    tokenData,
    quoteTokens,
    baseTokens,
    accountAddress: accountDomain.address(),
    authenticated: accountDomain.authenticated(),
    currentBlock: accountDomain.currentBlock(),
    showHelpModal: accountDomain.showHelpModal(),
    connected: true,
    gas: transferTokensFormDomain.getGas(),
    gasPrice: transferTokensFormDomain.getGasPrice(),
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

      const currentBlock = await getCurrentBlock()
      if (!currentBlock) throw new Error('')

      const pairs = await api.fetchPairs()
      const exchangeAddress = await api.getExchangeAddress()

      const tomoBalance: TokenBalance = await accountBalancesService.queryTomoBalance(
        accountAddress
      )
      
      const tokenBalances: TokenBalances = await accountBalancesService.queryTokenBalances(
        accountAddress,
        tokens
      )

      // Todo: Get balance from backend server, we will remove
      // const tomoBalance: TokenBalance = await api.fetchTomoBalance(accountAddress)
      // const tokenBalances: TokenBalances = await api.fetchTokenBalances(accountAddress, tokens)

      const balances = [tomoBalance].concat(tokenBalances)

      dispatch(accountActionTypes.updateCurrentBlock(currentBlock))
      dispatch(actionCreators.updateTokenPairs(pairs))
      dispatch(actionCreators.updateBalances(balances))
      dispatch(actionCreators.updateExchangeAddress(exchangeAddress))

      await accountBalancesService.subscribeTokenBalances(
        accountAddress,
        tokens,
        balance => dispatch(actionCreators.updateBalance(balance))
      )

      await accountBalancesService.subscribeTomoBalance(
        accountAddress,
        balance =>
          dispatch(
            actionCreators.updateBalance({
              symbol: NATIVE_TOKEN_SYMBOL,
              balance,
            })
          )
      )
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

export function redirectToTradingPage(symbol: string): ThunkAction {
  return async (dispatch, getState) => {
    const defaultQuoteToken = quoteTokens[0]
    const pair = `${symbol}/${defaultQuoteToken.symbol}`

    dispatch(actionCreators.updateCurrentPair(pair))
    dispatch(push('/trade'))
  }
}
