// @flow
const actionTypes = {
  updateCurrentPair: 'lendingMarkets/UPDATE_CURRENT_PAIR',
  updateFavorite: 'lendingMarkets/UPDATE_FAVORITE',
}

export function updateCurrentPair(pair: string) {
  return {
    type: actionTypes.updateCurrentPair,
    payload: pair,
  }
}

export function updateFavorite(code: string, favorite: boolean) {
  return {
    type: actionTypes.updateFavorite,
    payload: { code, favorite },
  }
}

export default actionTypes
