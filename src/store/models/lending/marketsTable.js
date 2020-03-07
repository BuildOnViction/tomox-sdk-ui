// @flow
import { push } from 'connected-react-router'

import {
  getAccountDomain,
  getTokenPairsDomain,
} from '../../domains'

import * as actionCreators from '../../actions/marketsTable'

import { quoteTokenSymbols as quoteTokens } from '../../../config/quotes'

import type { State, ThunkAction } from '../../../types'

export default function marketsTableSelector(state: State) {
  const accountDomain = getAccountDomain(state)
  const pairsDomain = getTokenPairsDomain(state)
  const loading = pairsDomain.loading()
  const referenceCurrency = accountDomain.referenceCurrency()
  const favoriteds = pairsDomain.getFavoritePairs()
  let pairs = pairsDomain.getTokenPairsWithDataArray()

  pairs = pairs.map(tokenPair => {
    tokenPair.favorited = favoriteds.includes(tokenPair.pair)
    return tokenPair
  })

  return {
    loading,
    pairs,
    quoteTokens,
    authenticated: accountDomain.authenticated(),
    currentReferenceCurrency: referenceCurrency ? referenceCurrency.symbol : '$',
  }
}

export function redirectToLendingPage(baseTokenSymbol: string, quoteTokenSymbol: string): ThunkAction {
  return async (dispatch, getState) => {
    const param = `${baseTokenSymbol}-${quoteTokenSymbol}`
    const pair = `${baseTokenSymbol}/${quoteTokenSymbol}`

    dispatch(actionCreators.updateCurrentPair(pair))
    dispatch(push(`/lending/${param}`))
  }
}

