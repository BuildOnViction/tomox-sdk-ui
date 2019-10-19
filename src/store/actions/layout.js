// @flow
import type { UpdateReferenceCurrencyAction, ShowSessionPasswordModal } from '../../types/layout'
import type { TokenPairs } from '../../types/tokens'

const actionTypes = {
  updateReferenceCurrency: 'layout/UPDATE_REFERENCE_CURRENCY',
  showSessionPasswordModal: 'layout/SHOW_SESSION_PASSWORD_MODAL',
  updateTokenPairs: 'layout/UPDATE_TOKEN_PAIRS',
}

export function updateTokenPairs(pairs: TokenPairs): UpdateTokenPairsAction {
  return {
    type: actionTypes.updateTokenPairs,
    payload: { pairs },
  }
}

export function updateReferenceCurrency(referenceCurrency: string): UpdateReferenceCurrencyAction {
  return {
    type: actionTypes.updateReferenceCurrency,
    payload: { referenceCurrency },
  }
}

export function showSessionPasswordModal(showSessionPasswordModal: Boolean): ShowSessionPasswordModal {
  return {
    type: actionTypes.showSessionPasswordModal,
    payload: { showSessionPasswordModal },
  }
}

export default actionTypes
