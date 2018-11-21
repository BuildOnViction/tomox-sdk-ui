//@flow
import {
  quoteTokens
} from '../../config/quotes';
import {
  tokens
} from '../../config/tokens';
import {
  generateTokenPairs,
  getPairSymbol,
  getBaseToken
} from '../../utils/tokens';

import type {
  Token,
  TokenPair,
  TokenPairState,
  TokenPairDataMap
} from '../../types/tokens';

const defaultTokenPairs = generateTokenPairs(quoteTokens, tokens);
const defaultInitialState: TokenPairState = {
  byPair: defaultTokenPairs,
  data: [],
  favorites: [],
  currentPair: (Object.values(defaultTokenPairs)[0]: any).pair
};

//By default the application is started with a default create from tokens in a configuration file. To
//create a tokenpair domain with less tokens, the initialized function can be called with a custom initial
//token pair state (that can be created with the createInitialState function).
export const initialized = (customInitialState ? : TokenPairState) => {
  let initialState = customInitialState || defaultInitialState;
  const event = (state: TokenPairState = initialState) => state;
  return event;
};

export const currentPairUpdated = (pair: string) => {
  const event = (state: TokenPairState) => ({
    ...state,
    currentPair: pair
  });

  return event;
};

export const tokenPairUpdated = (baseToken: Token) => {
  const event = (state: TokenPairState) => {
    if (baseToken.symbol === 'ETH') return;
    let newState = quoteTokens.reduce(
      (result, quoteToken) => {
        if (quoteToken.symbol === baseToken.symbol) return result;
        if (
          Object.keys(state.byPair).indexOf(
            getPairSymbol(quoteToken.symbol, baseToken.symbol)
          ) !== -1
        ) {
          return result;
        }

        let pairSymbol = getPairSymbol(baseToken.symbol, quoteToken.symbol);
        result.byPair[pairSymbol] = {
          pair: pairSymbol,
          baseTokenSymbol: baseToken.symbol,
          quoteTokenSymbol: quoteToken.symbol,
          baseTokenAddress: baseToken.address,
          quoteTokenAddress: quoteToken.address,
          baseTokenDecimals: baseToken.decimals,
          quoteTokenDecimals: quoteToken.decimals,
          pricepointMultiplier: 1e9
        };
        return result;
      }, {
        byPair: {}
      }
    );

    return {
      ...state,
      byPair: { ...state.byPair,
        ...newState.byPair
      }
    };
  };

  return event;
};

export const tokenPairRemoved = (baseToken: Token) => {
  const event = (state: TokenPairState) => {
    let newByPair = Object.keys(state.byPair)
      .filter(key => getBaseToken(key) !== baseToken.symbol)
      .reduce((result, current) => {
        result[current] = state.byPair[current];
        return result;
      }, {});

    return {
      byPair: newByPair
    };
  };

  return event;
};

const mergeByTokenPair = (arr1, arr2) => {
  return [...arr1, ...arr2.filter(item2 => arr1.findIndex(item1 => item1.pair === item2.pair) < 0)]
}

export const tokenPairDataUpdated = (tokenPairData: TokenPairDataMap) => {
  const event = (state: TokenPairState): TokenPairState => {
    let newState = {
      ...state,
      data: mergeByTokenPair(
        state.data,
        tokenPairData
      )
    };

    return newState;
  };
  return event;
};

export const tokenPairFavorited = (tokenPair: string, favorited: boolean) => {
  const event = (state: TokenPairState) => {
    let newState;

    favorited
      ?
      (newState = [...state.favorites, tokenPair]) :
      (newState = state.favorites.filter(elem => elem !== tokenPair));

    return {
      ...state,
      favorites: newState
    };
  };

  return event;
};

export default function getTokenPairsDomain(state: TokenPairState) {
  return {
    getPairs: (): any => Object.keys(state.byPair),
    getPair: (code: string): any => state.byPair[code],
    getPairsByCode: () => state.byPair,
    getTokenPairsData: () => state.data,
    getTokenPairsDataArray: () => Object.values(state.data),
    getFavoritePairs: () => state.favorites,
    getCurrentPair: (): TokenPair => state.byPair[state.currentPair]
  };
}