import { getAccountDomain, getTokenDomain } from "../domains"

import { quoteTokens } from "../../config/quotes"
import { NATIVE_TOKEN_SYMBOL } from "../../config/tokens"

import * as notifierActionCreators from "../actions/app"
import * as accountBalancesCreators from "../actions/accountBalances"
import * as accountBalancesService from "../services/accountBalances"

import type { Token } from "../../types/tokens"

export function queryAccountBalance(): ThunkAction {
  return async (dispatch, getState, { api, socket }) => {
    const state = getState()
    const accountAddress = getAccountDomain(state).address()

    try {
      let tokens = getTokenDomain(state).tokens()
      const quotes = quoteTokens

      tokens = quotes
        .concat(tokens)
        .filter((token: Token) => token.symbol !== NATIVE_TOKEN_SYMBOL)
        .reduce((newTokens, currentToken) => {
          // remove duplicate tokens
          const x = newTokens.find(item => item.symbol === currentToken.symbol)

          if (!x) {
            return [...newTokens, currentToken]
          }

          return newTokens
        }, [])

      const tomoBalance: TokenBalance = await accountBalancesService.queryTomoBalance(
        accountAddress
      )

      const tokenBalances: TokenBalances = await accountBalancesService.queryTokenBalances(
        accountAddress,
        tokens
      )

      const balancesInOders = await api.getBalancesInOrders(accountAddress)
      const balances = [tomoBalance].concat(tokenBalances)

      for (let i = 0; i < balances.length; i++) {
        balances[i]["inOrders"] = balancesInOders[balances[i].symbol]
      }

      dispatch(accountBalancesCreators.updateBalances(balances))
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
