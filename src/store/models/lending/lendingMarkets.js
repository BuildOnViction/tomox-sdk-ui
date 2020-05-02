// @flow
import { push } from 'connected-react-router'

import {
  getAccountDomain,
  getLendingPairsDomain,
  getLendingTokensDomain,
} from '../../domains'

import * as actionCreators from '../../actions/lending/lendingMarkets'
import type { State, ThunkAction } from '../../../types'

export default function marketsTableSelector(state: State) {
  const accountDomain = getAccountDomain(state)
  // const loading = pairsDomain.loading()
  const referenceCurrency = accountDomain.referenceCurrency()
  const lendingPairsDomain = getLendingPairsDomain(state)
  let pairs = lendingPairsDomain.getTokenPairsWithDataArray()
  const favoriteds = lendingPairsDomain.getFavoritePairs()

  pairs = pairs.map(pair => {
    pair.favorited = favoriteds.includes(pair.pair)
    return pair
  })

  const lendingTokensDomain = getLendingTokensDomain(state)
  const lendingTokens = lendingTokensDomain.tokenSymbols()
  
  return {
    // loading,
    pairs,
    lendingTokens,
    authenticated: accountDomain.authenticated(),
    currentReferenceCurrency: referenceCurrency ? referenceCurrency.symbol : '$',
  }
}

export function redirectToLendingPage(lendingPair): ThunkAction {
  return async (dispatch, getState) => {
    const param = lendingPair.pair.replace(/\s+/g, '_').replace('/', '-')
    dispatch(actionCreators.updateCurrentPair(lendingPair))
    dispatch(push(`/lending/${param}`))
  }
}

