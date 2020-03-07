// @flow
import {
  getAccountBalancesDomain,
  getAccountDomain,
  getTokenDomain,
  getTransferTokensFormDomain,
  getSettingsDomain,
} from '../domains'

import * as actionCreators from '../actions/walletPage'
import { quoteTokenSymbols } from '../../config/quotes'
import { push } from 'connected-react-router'
import type { State, ThunkAction } from '../../types'

export default function walletPageSelector(state: State) {
  const accountBalancesDomain = getAccountBalancesDomain(state)
  const accountDomain = getAccountDomain(state)
  const tokenDomain = getTokenDomain(state)
  const transferTokensFormDomain = getTransferTokensFormDomain(state)

  const tokens = tokenDomain.tokens()
  const quoteTokens = quoteTokenSymbols
  const baseTokens = tokenDomain
    .symbols()
    .filter(symbol => quoteTokens.indexOf(symbol) !== -1)
  const tokenData = accountBalancesDomain.getBalancesAndAllowances(tokens)
  const mode = getSettingsDomain(state).getMode()

  return {
    tomoBalance: accountBalancesDomain.formattedTomoBalance(),
    balancesLoading: accountBalancesDomain.loading(),
    tokenData,
    quoteTokens,
    baseTokens,
    accountAddress: accountDomain.address(),
    authenticated: accountDomain.authenticated(),
    currentBlock: accountDomain.currentBlock(),
    connected: true,
    gas: transferTokensFormDomain.getGas(),
    gasPrice: transferTokensFormDomain.getGasPrice(),
    mode,
  }
}

export function redirectToTradingPage(symbol: string): ThunkAction {
  return async (dispatch, getState) => {
    const quoteTokenIndex = quoteTokenSymbols.indexOf(symbol)
    let baseTokenSymbol, quoteTokenSymbol

    if (quoteTokenIndex === 0) {
      baseTokenSymbol = quoteTokenSymbols[1]
      quoteTokenSymbol = quoteTokenSymbols[0]
    } else {
      baseTokenSymbol = symbol
      quoteTokenSymbol = quoteTokenSymbols[0]
    }

    const pair = `${baseTokenSymbol}/${quoteTokenSymbol}`

    dispatch(actionCreators.updateCurrentPair(pair))
    dispatch(push('/trade'))
  }
}

export function redirectToLendingPage(): ThunkAction {
  return async (dispatch, getState) => {
    dispatch(push('/lending'))
  }
}
