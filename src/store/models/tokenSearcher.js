// @flow
import type { State, ThunkAction } from '../../types';
import { getTokenPairsDomain, getAccountBalancesDomain, getOhlcvDomain } from '../domains';
import * as actionCreators from '../actions/tokenSearcher';
// import * as ohlcvActionCreators from '../actions/ohlcv';

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
  return async (dispatch, getState, { api, socket }) => {
    try {
      socket.unsubscribeChart();
      socket.unsubscribeOrderBook();
      socket.unsubscribeTrades();

      const state = getState();
      dispatch(actionCreators.updateCurrentPair(pair));

      const pairDomain = getTokenPairsDomain(state);
      const ohlcvDomain = getOhlcvDomain(state)

      const newPair = pairDomain.getPair(pair);
      const { currentTimeSpan, currentDuration  } = ohlcvDomain.getState()

      socket.subscribeTrades(newPair);
      socket.subscribeOrderBook(newPair);
      socket.subscribeChart(
        newPair,
        currentTimeSpan.label,
        currentDuration.label
      );
    } catch (e) {
      console.log(e);
    }
  };
};
