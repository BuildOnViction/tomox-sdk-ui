// @flow
import type { UpdateReferenceCurrencyAction, ShowSessionPasswordModal } from '../../types/layout'
import type { TokenPairs } from '../../types/tokens'

const actionTypes = {
  updateReferenceCurrency: 'layout/UPDATE_REFERENCE_CURRENCY',
  showSessionPasswordModal: 'layout/SHOW_SESSION_PASSWORD_MODAL',
  updateTokenPairs: 'layout/UPDATE_TOKEN_PAIRS',
  updateLoadingTokenPair: 'layout/UPDATE_LOADING_TOKEN_PAIR',
  updateExchangeAddress: 'layout/UPDATE_EXCHANGE_ADDRESS',
  updateExchangeFee: 'layout/UPDATE_EXCHANGE_FEE',

  updateLendingPairs: 'layout/UPDATE_LENDING_PAIRS',
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

export function updateLoadingTokenPair(loading: Boolean) {
  return {
    type: actionTypes.updateLoadingTokenPair,
    payload: {loading},
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

export function updateExchangeFee(
  exchangeFee: string
): UpdateExchangeFeeAction {
  return {
    type: actionTypes.updateExchangeFee,
    payload: { exchangeFee },
  }
}

export function updateLendingPairs(pairs) {
  return {
    type: actionTypes.updateLendingPairs,
    payload: pairs,
  }
}

export default actionTypes
