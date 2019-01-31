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
// import { ALLOWANCE_THRESHOLD } from '../../utils/constants'
import { NATIVE_TOKEN_SYMBOL } from '../../config/tokens'

export default function walletPageSelector(state: State) {
  const accountBalancesDomain = getAccountBalancesDomain(state)
  const accountDomain = getAccountDomain(state)
  const tokenDomain = getTokenDomain(state)
  const transferTokensFormDomain = getTransferTokensFormDomain(state)

  // TOMO is not a token so we add it to the list to display in the deposit table
  const TOMO = {
    symbol: NATIVE_TOKEN_SYMBOL,
    address: '0x0',
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
    WETHBalance: accountBalancesDomain.tokenBalance('WETH'),
    WETHAllowance: accountBalancesDomain.tokenAllowance('WETH'),
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
      // const allowances = await accountBalancesService.queryExchangeTokenAllowances(
      //   accountAddress,
      //   tokens
      // )

      const balances = [tomoBalance].concat(tokenBalances)

      dispatch(accountActionTypes.updateCurrentBlock(currentBlock))
      dispatch(actionCreators.updateTokenPairs(pairs))
      dispatch(actionCreators.updateBalances(balances))
      // dispatch(actionCreators.updateAllowances(allowances))
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

export function redirectToTradingPage(symbol: string): ThunkAction {
  return async (dispatch, getState) => {
    const defaultQuoteToken = quoteTokens[0]
    const pair = `${symbol}/${defaultQuoteToken.symbol}`

    dispatch(actionCreators.updateCurrentPair(pair))
    dispatch(push('/trade'))
  }
}

export function toggleAllowance(symbol: string): ThunkAction {
  return async (dispatch, getState) => {
    try {
      const state = getState()
      // const tokens = getTokenDomain(state).bySymbol()
      // const accountAddress = getAccountDomain(state).address()
      // const isAllowed = getAccountBalancesDomain(state).isAllowed(symbol)
      const isPending = getAccountBalancesDomain(state).isAllowancePending(
        symbol
      )
      // const tokenContractAddress = tokens[symbol].address

      if (isPending) throw new Error('Trading approval pending')

      // const approvalConfirmedHandler = txConfirmed => {
      //   txConfirmed
      //     ? dispatch(
      //         notifierActionCreators.addSuccessNotification({
      //           message: `${symbol} Approval Successful. You can now start trading!`,
      //         })
      //       )
      //     : dispatch(
      //         notifierActionCreators.addErrorNotification({
      //           message: `${symbol} Approval Failed. Please try again.`,
      //         })
      //       )
      // }

      // const approvalRemovedHandler = txConfirmed => {
      //   txConfirmed
      //     ? dispatch(
      //         notifierActionCreators.addSuccessNotification({
      //           message: `${symbol} Allowance Removal Successful.`,
      //         })
      //       )
      //     : dispatch(
      //         notifierActionCreators.addErrorNotification({
      //           message: `${symbol} Allowance Removal Failed. Please try again.`,
      //         })
      //       )
      // }

      // if (isAllowed) {
      //   accountBalancesService.updateExchangeAllowance(
      //     tokenContractAddress,
      //     accountAddress,
      //     0,
      //     approvalRemovedHandler
      //   )
      //   dispatch(
      //     notifierActionCreators.addSuccessNotification({
      //       message: `Locking ${symbol}. You will not be able to trade ${symbol} after the transaction is confirmed`,
      //     })
      //   )
      // } else {
      //   accountBalancesService.updateExchangeAllowance(
      //     tokenContractAddress,
      //     accountAddress,
      //     ALLOWANCE_THRESHOLD,
      //     approvalConfirmedHandler
      //   )
      //   dispatch(
      //     notifierActionCreators.addSuccessNotification({
      //       message: `Unlocking ${symbol}. You will be able to trade  ${symbol} after the transaction is confirmed.`,
      //     })
      //   )
      // }

      // dispatch(
      //   actionCreators.updateAllowance({
      //     symbol,
      //     allowance: 'pending',
      //   })
      // )
    } catch (e) {
      console.log(e)
      if (e.message === 'Trading approval pending') {
        dispatch(
          notifierActionCreators.addErrorNotification({
            message: 'Trading approval pending',
          })
        )
      }
    }
  }
}
