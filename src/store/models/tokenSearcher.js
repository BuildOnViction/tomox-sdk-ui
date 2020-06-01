// @flow
import type { State, ThunkAction } from '../../types'
import { getTokenPairsDomain, getAccountBalancesDomain } from '../domains'
import * as actionCreators from '../actions/tokenSearcher'
// import * as ohlcvActionCreators from '../actions/ohlcv';
import { push } from 'connected-react-router'

import { getQuoteToken, getBaseToken } from '../../utils/tokens'
import { quoteTokenSymbols as quotes } from '../../config/quotes'

export default function tokenSearcherSelector(state: State) {
  const domain = getTokenPairsDomain(state)
  const accountBalancesDomain = getAccountBalancesDomain(state)
  const tokenPairs = domain.getTokenPairsDataArray()
  const favoriteTokenPairs = domain.getFavoritePairs()

  const tokenPairsByQuoteToken = {}

  for (const quote of quotes) {
    tokenPairsByQuoteToken[quote] = tokenPairs
      .filter(({ pair }) => getQuoteToken(pair) === quote)
      .map(tokenPair => ({
        ...tokenPair,
        base: getBaseToken(tokenPair.pair),
        quote: getQuoteToken(tokenPair.pair),
      }))
      .map(tokenPair => ({
        ...tokenPair,
        favorited: favoriteTokenPairs.indexOf(tokenPair.pair) > -1,
      }))
  }

  const currentPair = domain.getCurrentPair()
  if (currentPair) {
    const baseTokenBalance = accountBalancesDomain.tokenBalance(currentPair.baseTokenSymbol)
    const quoteTokenBalance = accountBalancesDomain.tokenBalance(currentPair.quoteTokenSymbol)

    return {
      tokenPairsByQuoteToken,
      currentPair,
      baseTokenBalance,
      quoteTokenBalance,
    }
  }
}

export const updateCurrentPair = (pairName: string): ThunkAction => {
    return async (dispatch, getState) => {
      const state = getState()
      const tokenPairsDomain = getTokenPairsDomain(state)
      const pairs = tokenPairsDomain.getPairsByCode()
      const currentPair = tokenPairsDomain.getCurrentPair()
      const pair = pairs[pairName]

      const param = pairName.replace('/', '-')
      let { router: { location: { pathname }}} = getState()
      pathname = pathname.includes('dapp/spot/pairs') ? 'dapp/trade' : (pathname.includes('dapp/spot') ? 'dapp/spot' : 'trade')

      if (currentPair.pair !== pairName) dispatch(actionCreators.updateCurrentPair(pair))
      dispatch(push(`/${pathname}/${param}`))
    }
}
