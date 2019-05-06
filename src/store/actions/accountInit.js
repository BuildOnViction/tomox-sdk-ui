// @flow
import type {
  UpdateAccountAllowancesAction,
  UpdateAccountAllowanceAction,
  UpdateAccountBalancesAction,
  UpdateAccountBalanceAction,
  UpdateTokenPairsAction,
  UpdateExchangeAddressAction,
  UpdateCurrentPairAction,
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
  updateCurrentPair: 'accountInit/UPDATE_CURRENT_PAIR',
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

export function updateCurrentPair(pair: string): UpdateCurrentPairAction {
  return {
    type: actionTypes.updateCurrentPair,
    payload: { pair },
  }
}

export default actionTypes
