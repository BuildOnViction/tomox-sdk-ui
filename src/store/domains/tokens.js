// @flow
import {
  addElementToArray,
  addKeyToObject,
  arrayWithoutElement,
  objectWithoutKey
} from '../../helpers/utils';
import { tokensBySymbol, tokenSymbols } from '../../config/tokens';

import type { TokenState, Token, TokenImage } from '../../types/tokens';

// we should generate these tokenSymbols instead of waiting for websocket update
const initialState = {
  symbols: tokenSymbols,
  bySymbol: tokensBySymbol
};

// console.log(initialState);

// let initialState;
// // initialState for testing only
// if (process.env === 'jsdom') {
//   initialState = {
//     symbols: tokenSymbols,
//     bySymbol: tokensBySymbol,
//   };
// } else {
//   initialState = {
//     symbols: [],
//     bySymbol: {},
//   };
// }

export const initialized = () => {
  const event = (state: TokenState = initialState) => state;
  return event;
};

// update the whole tokenList
export const tokenListUpdated = (tokens: Array<Token>) => {
  const symbols = tokens.map(token => token.symbol);
  const bySymbol = tokens.reduce((map, token) => {
    map[token.symbol] = token;
    return map;
  }, {});
  const event = (state: TokenState) => ({
    ...state,
    symbols,
    bySymbol
  });
  return event;
};

export const tokenUpdated = (
  symbol: string,
  address: string,
  image: ?TokenImage
) => {
  const event = (state: TokenState) => ({
    ...state,
    symbols: addElementToArray(state.symbols, symbol),
    bySymbol: addKeyToObject(state.bySymbol, symbol, { symbol, address, image })
  });
  return event;
};

export const tokenRemoved = (symbol: string) => {
  const event = (state: TokenState) => ({
    ...state,
    symbols: arrayWithoutElement(state.symbols, symbol),
    bySymbol: objectWithoutKey(state.bySymbol, symbol)
  });
  return event;
};

export default function getTokenDomain(state: TokenState) {
  return {
    bySymbol: () => state.bySymbol,
    symbols: () => state.symbols,
    tokens: () => Object.values(state.bySymbol),
    rankedTokens: () =>
      (Object.values(state.bySymbol): any).map((m, index) => ({
        ...m,
        rank: index + 1
      }))
  };
}
