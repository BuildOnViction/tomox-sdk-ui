// @flow
import type { State, ThunkAction } from '../../types';
import { getTokenPairsDomain, getAccountBalancesDomain } from '../domains';
import * as actionCreators from '../actions/tokenSearcher';
// import * as ohlcvActionCreators from '../actions/ohlcv';
import { push } from 'connected-react-router'

import { getQuoteToken, getBaseToken } from '../../utils/tokens';
import { quoteTokenSymbols as quotes } from '../../config/quotes';

export default function tokenSearcherSelector(state: State) {
  let domain = getTokenPairsDomain(state);
  let accountBalancesDomain = getAccountBalancesDomain(state);
  let tokenPairs = domain.getTokenPairsDataArray();
  let favoriteTokenPairs = domain.getFavoritePairs();

  let tokenPairsByQuoteToken = {};

  for (let quote of quotes) {
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
      }));
  }

  let currentPair = domain.getCurrentPair();
  if (currentPair) {
    let baseTokenBalance = accountBalancesDomain.tokenBalance(currentPair.baseTokenSymbol);
    let quoteTokenBalance = accountBalancesDomain.tokenBalance(currentPair.quoteTokenSymbol);

    return {
      tokenPairsByQuoteToken,
      currentPair,
      baseTokenBalance,
      quoteTokenBalance,
    };
  }
}

export const updateCurrentPair = (pair: string): ThunkAction => {
    return async (dispatch, getState) => {
      const param = pair.replace('/', '-')
      let { router: { location: { pathname }}} = getState()
      pathname = pathname.includes('trade-mobile') ? 'trade-mobile' : 'trade'

      dispatch(actionCreators.updateCurrentPair(pair))
      dispatch(push(`/${pathname}/${param}`))
    }
};
