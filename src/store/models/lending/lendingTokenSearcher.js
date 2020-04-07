// @flow
import type { State, ThunkAction } from '../../../types'
import { 
  getAccountDomain,
  getLendingPairsDomain,
  getLendingTokensDomain, 
} from '../../domains'
import * as actionCreators from '../../actions/lending/lendingTokenSearcher'
import { push } from 'connected-react-router'

export default function tokenSearcherSelector(state: State) {
  const accountDomain = getAccountDomain(state)
  const lendingPairsDomain = getLendingPairsDomain(state)
  const currentPair = lendingPairsDomain.getCurrentPair()
  let pairs = lendingPairsDomain.getTokenPairsWithDataArray()
  const favoriteds = lendingPairsDomain.getFavoritePairs()

  pairs = pairs.map(pair => {
    pair.favorited = favoriteds.includes(pair.pair)
    return pair
  })

  const lendingTokensDomain = getLendingTokensDomain(state)
  const lendingTokens = lendingTokensDomain.tokenSymbols()

  return {
    pairs,
    currentPair,
    lendingTokens,
    authenticated: accountDomain.authenticated(),
  }
}

export const updateCurrentPair = (pair: string): ThunkAction => {
    return async (dispatch, getState) => {
      const param = pair.replace(' ', '_').replace('/', '-')
      dispatch(actionCreators.updateCurrentPair(pair))
      dispatch(push(`/lending/${param}`))
    }
}
