//@flow
import { quoteTokens } from '../../../config/quotes'
import { tokens } from '../../../config/tokens'
import {
  generateTokenPairs,
  getPairSymbol,
} from '../../../utils/tokens'
import { getTermSymbol } from '../../../utils/helpers'

import type {
  TokenPair,
  TokenPairs,
  TokenPairState,
  TokenPairData,
  TokenPairDataMap,
  CurrentTokenPairData,
} from '../../../types/tokens'

export const initialized = (customInitialState?: TokenPairState) => {
  const defaultTokenPairs = generateTokenPairs(quoteTokens, tokens)
  const defaultTokenPair = Object.values(defaultTokenPairs)[0]
  const defaultInitialState: TokenPairState = {
    byPair: {},
    data: {},
    favorites: [],
    currentPair: (defaultTokenPair: any).pair,
    sortedPairs: [],
    loading: false,
  }

  const initialState = customInitialState || defaultInitialState
  const event = (state: TokenPairState = initialState) => state
  return event
}

export const updateCurrentPair = (pair: string) => {
  const event = (state: TokenPairState) => ({
    ...state,
    currentPair: pair,
  })

  return event
}

export const updatePairs = (pairs) => {
  const event = (state) => {
    const byPair = pairs.reduce(
      (result, pair) => {
        const termSymbol = getTermSymbol(pair.term)
        const pairSymbol = `${termSymbol}/${pair.lendingTokenSymbol}`

        result[pairSymbol] = {
          lendingTokenAddress: pair.lendingTokenAddress,
          lendingTokenDecimals: pair.lendingTokenDecimals,
          lendingTokenSymbol: pair.lendingTokenSymbol,
          termValue: pair.term,
          termSymbol,
        }

        return result
      },
      {}
    )

    const sortedPairs = pairs.map(pair => {
      const termSymbol = getTermSymbol(pair.term)
      return `${termSymbol}/${pair.lendingTokenSymbol}`
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

export const tokenPairRemoved = (pair: pairToken) => {
  const event = (state: TokenPairState) => {
    const newByPair = Object.keys(state.byPair)
      .filter(pairName => pairName !== pair.pair)
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

export const lendingPairsDataUpdated = (lendingPairsData) => {
  const event = (state) => {

    const data = lendingPairsData.reduce((result, item) => {
      return {
        ...result,
        [item.name]: {
          ...state.data[item.name],
          ...item,
        },
      }
    }, {})

    const newState = {
      ...state,
      data: {
        ...state.data,
        ...data,
      },
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

export const updateCurrentPairData = (currentPairData: CurrentTokenPairData) => {
  const event = (state: TokenPairState): TokenPairState => {
    return {
      ...state,
      currentPairData,
    }
  }

  return event
}

export const updateLoading = (loading: Boolean) => {
  const event = (state: TokenPairState): TokenPairState => {
    return {
      ...state,
      loading,
    }
  }

  return event
}

export default function getLendingPairsDomain(state: TokenPairState) {
  return {
    loading: (): Boolean => state.loading,
    getPairs: (): any => Object.keys(state.byPair),
    getPair: (code: string): any => state.byPair[code],
    getPairsByCode: () => state.byPair,
    getTokenPairsData: () => state.data,
    getTokenPairsDataArray: () => Object.values(state.data),
    getFavoritePairs: () => state.favorites,
    getCurrentPair: (): TokenPair => state.byPair[state.currentPair] || {},
    getCurrentPairData: () => state.currentPairData,

    //Merge token pair properties and data
    getTokenPairsWithDataObject: () => {
      const symbols = Object.keys(state.byPair)
      return symbols.reduce((
        (result, symbol) => {
          if (state.data[symbol] && state.byPair[symbol]) {
            result[symbol] = {
              ...state.data[symbol],
              ...state.byPair[symbol],
            }
          }

          return result
        }
      ), {})
    },

    getTokenPairsWithDataArray: () => {
      const tokenPairData = []
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
