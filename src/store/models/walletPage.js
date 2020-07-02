// @flow
import {
  getAccountBalancesDomain,
  getAccountDomain,
  getTokenDomain,
  getTokenPairsDomain,
  getTransferTokensFormDomain,
  getSettingsDomain,
  getLendingTokensDomain,
  getLendingPairsDomain,
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
  const lendingTokensDomain = getLendingTokensDomain(state)
  const lendingTokenSymbols = lendingTokensDomain.tokenSymbols()
  const collateralTokenSymbols = lendingTokensDomain.collateralSymbols()
  const totalBalance = accountBalancesDomain.getTotalBalance()

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
    lendingTokenSymbols,
    collateralTokenSymbols,
    totalBalance,
  }
}

export function redirectToTradingPage(symbol: string): ThunkAction {
  return async (dispatch, getState) => {
    const state = getState()
    const pairs = getTokenPairsDomain(state).getPairsArray()

    if (!pairs.length) return

    let pair = pairs.find(pair => pair.pair.includes(symbol))
    pair = pair ? pair : pairs[0]

    dispatch(actionCreators.updateCurrentPair(pair))
    dispatch(push(`/trade/${pair.pair.replace('/', '-')}`))
  }
}

export function redirectToLendingPage(symbol: string): ThunkAction {
  return async (dispatch, getState) => {
    const state = getState()
    const lendingPairSymbols = getLendingPairsDomain(state).getPairs()
    if (!lendingPairSymbols.length) return

    let lendingPair = lendingPairSymbols.find(pair => pair.pair.includes(symbol))
    lendingPair = lendingPair ? lendingPair : lendingPairSymbols[0]
    dispatch(push(`/lending/${lendingPair.pair.replace(' ', '_').replace('/', '-')}`))
  }
}
