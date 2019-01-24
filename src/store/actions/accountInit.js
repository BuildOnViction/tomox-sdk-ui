// @flow
import type {
  UpdateAccountAllowancesAction,
  UpdateAccountAllowanceAction,
  UpdateAccountBalancesAction,
  UpdateAccountBalanceAction,
  UpdateTokenPairsAction,
  UpdateExchangeAddressAction,
} from "../../types/accountInit"
import type { TokenPairs } from "../../types/tokens"

import type {
  AccountAllowances,
  AccountBalances,
  AccountBalance,
  AccountAllowance,
} from "../../types/accountBalances"

const actionTypes = {
  updateBalance: "accountInit/UPDATE_BALANCE",
  updateBalances: "accountInit/UPDATE_BALANCES",
  updateAllowance: "accountInit/UPDATE_ALLOWANCE",
  updateAllowances: "accountInit/UPDATE_ALLOWANCES",
  updateTokenPairs: "accountInit/UPDATE_TOKEN_PAIRS",
  updateExchangeAddress: "accountInit/UPDATE_EXCHANGE_ADDRESS",
}

export function updateTokenPairs(pairs: TokenPairs): UpdateTokenPairsAction {
  return {
    type: actionTypes.updateTokenPairs,
    payload: { pairs }
  }
}

export function updateBalances(
  balances: AccountBalances
): UpdateAccountBalancesAction {
  return {
    type: actionTypes.updateBalances,
    payload: { balances }
  }
}

export function updateBalance(
  balance: AccountBalance
): UpdateAccountBalanceAction {
  return {
    type: actionTypes.updateBalance,
    payload: balance
  }
}

export function updateAllowances(
  allowances: AccountAllowances
): UpdateAccountAllowancesAction {
  return {
    type: actionTypes.updateAllowances,
    payload: { allowances }
  }
}

export function updateAllowance(
  allowance: AccountAllowance
): UpdateAccountAllowanceAction {
  return {
    type: actionTypes.updateAllowance,
    payload: allowance
  }
}

export function updateExchangeAddress(
  exchangeAddress: string
): UpdateExchangeAddressAction {
  return {
    type: actionTypes.updateExchangeAddress,
    payload: { exchangeAddress }
  }
}

export default actionTypes
