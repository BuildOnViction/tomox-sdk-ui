// @flow
import type {
  UpdateTokenPairsAction,
  UpdateCurrentPairAction,
  UpdateExchangeAddressAction,
} from '../../types/walletPage'

const actionTypes = {
  updateAllowance: 'walletPage/UPDATE_ALLOWANCE',
  updateAllowances: 'walletPage/UPDATE_ALLOWANCES',
  updateCurrentPair: 'walletPage/UPDATE_CURRENT_PAIR',
  updateShowHelpModal: 'walletPage/UPDATE_SHOW_HELP_MODAL',
  updateExchangeAddress: 'walletPage/UPDATE_EXCHANGE_ADDRESS',
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
