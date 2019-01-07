//@flow
import { quoteTokens } from '../../config/quotes'
import { tokens } from '../../config/tokens'
import {
  generateTokenPairs,
  getPairSymbol,
  getBaseToken,
} from '../../utils/tokens'

import type {
  Token,
  TokenPair,
  TokenPairs,
  TokenPairState,
  TokenPairData,
  TokenPairDataMap,
} from '../../types/tokens'

const defaultTokenPairs = generateTokenPairs(quoteTokens, tokens)
const defaultInitialState: TokenPairState = {
  byPair: defaultTokenPairs,
  data: [],
  favorites: [],
  currentPair: (Object.values(defaultTokenPairs)[0]: any).pair,
  sortedPairs: [],
}

//By default the application is started with a default create from tokens in a configuration file. To
//create a tokenpair domain with less tokens, the initialized function can be called with a custom initial
//token pair state (that can be created with the createInitialState function).
export const initialized = (customInitialState?: TokenPairState) => {
  const initialState = customInitialState || defaultInitialState
  const event = (state: TokenPairState = initialState) => state
  return event
}

export const currentPairUpdated = (pair: string) => {
  const event = (state: TokenPairState) => ({
    ...state,
    currentPair: pair,
  })

  return event
}

export const tokenPairsUpdated = (pairs: TokenPairs) => {
  const event = (state: TokenPairState) => {
    const byPair = pairs.reduce(
      (result, pair) => {
        const pairSymbol = getPairSymbol(pair.baseTokenSymbol, pair.quoteTokenSymbol)
        result[pairSymbol] = {
          pair: pairSymbol,
          baseTokenSymbol: pair.baseTokenSymbol,
          quoteTokenSymbol: pair.quoteTokenSymbol,
          baseTokenAddress: pair.baseTokenAddress,
          quoteTokenAddress: pair.quoteTokenAddress,
          baseTokenDecimals: pair.baseTokenDecimals,
          quoteTokenDecimals: pair.quoteTokenDecimals,
          makeFee: pair.makeFee,
          takeFee: pair.takeFee,
          listed: pair.listed,
          active: pair.active,
          rank: pair.rank,
        }

        return result
      },
      {}
    )

    const sortedPairs = pairs.map(pair => {
      const pairSymbol = getPairSymbol(pair.baseTokenSymbol, pair.quoteTokenSymbol)
      return pairSymbol
    })

    return {
      ...state,
      byPair: {
        ...state.byPair,
        ...byPair,
      },
      sortedPairs: [...new Set([...state.sortedPairs, ...sortedPairs])],
    }
  }

  return event
}

export const tokenPairsReset = (pairs: TokenPairs) => {
  const event = (state: TokenPairState) => {
    const byPair = pairs.reduce(
      (result, pair) => {
        const pairSymbol = getPairSymbol(pair.baseTokenSymbol, pair.quoteTokenSymbol)
        result[pairSymbol] = {
          pair: pairSymbol,
          baseTokenSymbol: pair.baseTokenSymbol,
          quoteTokenSymbol: pair.quoteTokenSymbol,
          baseTokenAddress: pair.baseTokenAddress,
          quoteTokenAddress: pair.quoteTokenAddress,
          baseTokenDecimals: pair.baseTokenDecimals,
          quoteTokenDecimals: pair.quoteTokenDecimals,
          makeFee: pair.makeFee,
          takeFee: pair.takeFee,
          listed: pair.listed,
          active: pair.active,
          rank: pair.rank,
        }

        return result
      },
      {}
    )

    const sortedPairs = pairs.map(pair => {
      const pairSymbol = getPairSymbol(pair.baseTokenSymbol, pair.quoteTokenSymbol)
      return pairSymbol
    })

    return {
      ...state,
      byPair,
      sortedPairs: [...new Set([...sortedPairs])],
    }
  }

  return event
}

export const tokenPairRemoved = (baseToken: Token) => {
  const event = (state: TokenPairState) => {
    const newByPair = Object.keys(state.byPair)
      .filter(key => getBaseToken(key) !== baseToken.symbol)
      .reduce((result, current) => {
        result[current] = state.byPair[current]
        return result
      }, {})

    return {
      byPair: newByPair,
    }
  }

  return event
}

/**
 * Merge two arrays of token pairs
 * @param {*} arr1
 * @param {*} arr2
 */
const mergeByTokenPair = (
  arr1: TokenPairData[],
  arr2: TokenPairData[]
): TokenPairData[] => {
  return [
    ...arr1,
    ...arr2.filter(
      item2 => arr1.findIndex(item1 => item1.pair === item2.pair) < 0
    ),
  ]
}

export const tokenPairDataUpdated = (tokenPairData: TokenPairDataMap) => {
  const event = (state: TokenPairState): TokenPairState => {
    const newState = {
      ...state,
      data: mergeByTokenPair(state.data, tokenPairData),
    }

    return newState
  }

  return event
}

export const tokenPairFavorited = (tokenPair: string, favorited: boolean) => {
  const event = (state: TokenPairState): TokenPairState => {
    const newState = favorited
      ? [...state.favorites, tokenPair]
      : state.favorites.filter(elem => elem !== tokenPair)

    return {
      ...state,
      favorites: newState,
    }
  }

  return event
}

export default function getTokenPairsDomain(state: TokenPairState) {
  return {
    getPairs: (): any => Object.keys(state.byPair),
    getPair: (code: string): any => state.byPair[code],
    getPairsByCode: () => state.byPair,
    getTokenPairsData: () => state.data,
    getTokenPairsDataArray: () => Object.values(state.data),
    getFavoritePairs: () => state.favorites,
    getCurrentPair: (): TokenPair => state.byPair[state.currentPair],
    getTokenPairsWithDataArray: () => {
      let tokenPairData = []
      const symbols = state.sortedPairs

      symbols.forEach(symbol => {
        if (state.data[symbol] && state.byPair[symbol]) {
          tokenPairData.push({
            ...state.data[symbol],
            ...state.byPair[symbol],
          })
        }
      })

      return tokenPairData
    },
  }
}
