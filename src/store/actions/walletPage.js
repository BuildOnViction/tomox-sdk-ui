// @flow
import type {
  UpdateCurrentPairAction,
  UpdateExchangeAddressAction,
} from '../../types/walletPage'

const actionTypes = {
  updateAllowance: 'walletPage/UPDATE_ALLOWANCE',
  updateAllowances: 'walletPage/UPDATE_ALLOWANCES',
  updateCurrentPair: 'walletPage/UPDATE_CURRENT_PAIR',
  updateShowHelpModal: 'walletPage/UPDATE_SHOW_HELP_MODAL',
  updateExchangeAddress: 'walletPage/UPDATE_EXCHANGE_ADDRESS',
  updateShowHideBalance: 'walletPage/UPDATE_SHOW_HIDE_BALANCE',
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
// Action showHideBalance
export function updateShowHideBalance(showBalance) {
  return {
    type: actionTypes.updateShowHideBalance,
    payload: { showBalance },
  }
}

export default actionTypes
