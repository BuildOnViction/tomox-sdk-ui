import type {
    CurrentTokenPairData,
} from '../../types/tokens'

const actionTypes = {
    updateCurrentPairData: 'tokenPair/UPDATE_CURRENT_PAIR_DATA',
}

export function updateCurrentPairData(data: CurrentTokenPairData) {
    return {
      type: actionTypes.updateCurrentPairData,
      payload: data,
    }
}

export default actionTypes