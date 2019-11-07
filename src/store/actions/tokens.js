//@flow

import type { Token } from '../../types/tokens'

const actionTypes = {
  updateTokensList: 'tokens/UPDATE_TOKENS_LIST',
  updateTokens: 'tokens/UPDATE_TOKENS',
  removeTokens: 'tokens/REMOVE_TOKENS',
}

export function updateTokensList(tokens: Array<Token>) {
  return {
    type: actionTypes.updateTokensList,
    payload: tokens,
  }
}

//deprecated
export function updateTokens(address: string, symbol: string) {
  return {
    type: actionTypes.updateTokens,
    payload: { address, symbol },
  }
}

//deprecated
export function removeTokens(symbol: string) {
  return {
    type: actionTypes.removeTokens,
    payload: { symbol },
  }
}

export default actionTypes
