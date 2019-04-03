// @flow
import { getAccountDomain, getTokenDomain } from "../domains"

import * as actionCreators from "../actions/accountInit"
import * as notifierActionCreators from "../actions/app"
import * as accountActionTypes from "../actions/account"
// import * as accountBalancesService from "../services/accountBalances"
import { quoteTokens } from "../../config/quotes"
import { getCurrentBlock } from "../services/wallet"
import type { ThunkAction } from "../../types"
import type { Token, TokenBalance, TokenBalances } from "../../types/tokens"
import { NATIVE_TOKEN_SYMBOL } from "../../config/tokens"

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
      if (!accountAddress) throw new Error("Account address is not set")

      const currentBlock = await getCurrentBlock()
      if (!currentBlock) throw new Error("")

      const pairs = await api.fetchPairs()
      const exchangeAddress = await api.getExchangeAddress()

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
      const tokenPairData = await api.fetchTokenPairData()

      dispatch(actionCreators.updateCurrentPair(tokenPairData[0].pair.pairName))
      dispatch(accountActionTypes.updateCurrentBlock(currentBlock))
      dispatch(actionCreators.updateTokenPairs(pairs))
      dispatch(actionCreators.updateBalances(balances))
      // dispatch(actionCreators.updateAllowances(allowances))
      dispatch(actionCreators.updateExchangeAddress(exchangeAddress))

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
          message: "Could not connect to Tomochain network"
        })
      )
      console.log(e)
    }
  }
}
