// @flow
import type {
  UpdateAccountAllowancesAction,
  UpdateAccountAllowanceAction,
  UpdateTokenPairsAction,
  UpdateCurrentPairAction,
  UpdateExchangeAddressAction,
} from '../../types/walletPage'
import type { TokenPairs } from '../../types/tokens'

import type {
  AccountAllowances,
  AccountAllowance,
} from '../../types/accountBalances'

const actionTypes = {
  updateAllowance: 'walletPage/UPDATE_ALLOWANCE',
  updateAllowances: 'walletPage/UPDATE_ALLOWANCES',
  updateCurrentPair: 'walletPage/UPDATE_CURRENT_PAIR',
  updateTokenPairs: 'walletPage/UPDATE_TOKEN_PAIRS',
  updateShowHelpModal: 'walletPage/UPDATE_SHOW_HELP_MODAL',
  updateExchangeAddress: 'walletPage/UPDATE_EXCHANGE_ADDRESS',
}

export function updateTokenPairs(pairs: TokenPairs): UpdateTokenPairsAction {
  return {
    type: actionTypes.updateTokenPairs,
    payload: { pairs },
  }
}

export function updateAllowances(
  allowances: AccountAllowances
): UpdateAccountAllowancesAction {
  return {
    type: actionTypes.updateAllowances,
    payload: { allowances },
  }
}

export function updateAllowance(
  allowance: AccountAllowance
): UpdateAccountAllowanceAction {
  return {
    type: actionTypes.updateAllowance,
    payload: allowance,
  }
}

export function updateExchangeAddress(
  exchangeAddress: string
): UpdateExchangeAddressAction {
  return {
    type: actionTypes.updateExchangeAddress,
    payload: { exchangeAddress },
  }
}

export function updateCurrentPair(pair: string): UpdateCurrentPairAction {
  return {
    type: actionTypes.updateCurrentPair,
    payload: { pair },
  }
}

export function closeHelpModal() {
  return {
    type: actionTypes.updateShowHelpModal,
    payload: { showHelpModal: false },
  }
}

export default actionTypes
