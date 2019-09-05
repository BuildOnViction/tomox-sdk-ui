// @flow
import type { UpdateReferenceCurrencyAction, ShowSessionPasswordModal } from '../../types/layout'

const actionTypes = {
  updateReferenceCurrency: 'layout/UPDATE_REFERENCE_CURRENCY',
  showSessionPasswordModal: 'layout/SHOW_SESSION_PASSWORD_MODAL',
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
