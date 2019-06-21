// @flow
import type { AccountAllowance, AccountAllowances } from './accountBalances'

export type UpdateAccountAllowanceAction = {
  type: 'walletPage/UPDATE_ALLOWANCE',
  payload: AccountAllowance
};

export type UpdateAccountAllowancesAction = {
  type: 'walletPage/UPDATE_ALLOWANCES',
  payload: { allowances: AccountAllowances }
};

export type UpdateCurrentPairAction = {
  type: 'walletPage/UPDATE_CURRENT_PAIR',
  payload: { pair: string }
};

export type ClearAccountBalancesAction = {
  type: 'walletPage/CLEAR_BALANCES'
};

export type UpdateTokenPairsAction = {
  type: 'walletPage/UPDATE_TOKEN_PAIRS',
  payload: { pairs: Array<TokenPair> }
};

export type UpdateExchangeAddressAction = {
  type: 'walletPage/UPDATE_EXCHANGE_ADDRESS',
  payload: { exchangeAddress: string }
};

export type WalletPageActions =
  | UpdateCurrentPairAction
  | UpdateAccountAllowanceAction
  | UpdateAccountAllowancesAction
  | UpdateTokenPairsAction
  | UpdateExchangeAddressAction;
