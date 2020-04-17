const actionTypes = {
    updateLendingPairs: 'lendingPairs/UPDATE_LENDING_PAIRS',
    updateCurrentPairData: 'lendingPairs/UPDATE_CURRENT_PAIR_DATA',
}

export function updateLendingPairs(pairs) {
    return {
      type: actionTypes.updateLendingPairs,
      payload: pairs,
    }
}

export function updateCurrentPairData(pair) {
    return {
      type: actionTypes.updateCurrentPairData,
      payload: pair,
    }
}

export default actionTypes