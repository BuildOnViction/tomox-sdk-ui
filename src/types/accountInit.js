// @flow
import type { AccountAllowance, AccountAllowances, AccountBalance, AccountBalances } from './accountBalances'

export type UpdateAccountBalanceAction = {
  type: 'accountInit/UPDATE_BALANCE',
  payload: AccountBalance
};

export type UpdateAccountBalancesAction = {
  type: 'accountInit/UPDATE_BALANCES',
  payload: { balances: AccountBalances }
};

export type UpdateAccountAllowanceAction = {
  type: 'accountInit/UPDATE_ALLOWANCE',
  payload: AccountAllowance
};

export type UpdateAccountAllowancesAction = {
  type: 'accountInit/UPDATE_ALLOWANCES',
  payload: { allowances: AccountAllowances }
};

export type UpdateCurrentPairAction = {
  type: 'accountInit/UPDATE_CURRENT_PAIR',
  payload: { pair: string }
};

export type ClearAccountBalancesAction = {
  type: 'accountInit/CLEAR_BALANCES'
};

export type UpdateTokenPairsAction = {
  type: 'accountInit/UPDATE_TOKEN_PAIRS',
  payload: { pairs: Array<TokenPair> }
};

export type UpdateExchangeAddressAction = {
  type: 'accountInit/UPDATE_EXCHANGE_ADDRESS',
  payload: { exchangeAddress: string }
};

export type AccountInitActions =
  | UpdateCurrentPairAction
  | UpdateAccountBalanceAction
  | UpdateAccountBalancesAction
  | UpdateAccountAllowanceAction
  | UpdateAccountAllowancesAction
  | UpdateTokenPairsAction
  | UpdateExchangeAddressAction
