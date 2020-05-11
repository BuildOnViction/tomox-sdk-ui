//@flow
// import { quoteTokens } from '../../config/quotes'
// import { tokens } from '../../config/tokens'
import {
  // generateTokenPairs,
  getPairSymbol,
} from '../../utils/tokens'

import type {
  TokenPair,
  TokenPairs,
  TokenPairState,
  TokenPairData,
  TokenPairDataMap,
  CurrentTokenPairData,
} from '../../types/tokens'

export const initialized = (customInitialState?: TokenPairState) => {
  const addresses = JSON.parse(sessionStorage.getItem('addresses'))
  const defaultTokenPairs = addresses ? addresses.pairs : {}
  const defaultTokenPair = Object.values(defaultTokenPairs)

  const defaultInitialState: TokenPairState = {
    byPair: defaultTokenPairs,
    data: {},
    favorites: [],
    currentPair: defaultTokenPair || {},
    currentPairData: null,
    sortedPairs: [],
    smallChartsData: null,
    loading: false,
  }

  const initialState = customInitialState || defaultInitialState
  const event = (state: TokenPairState = initialState) => state
  return event
}

export const currentPairUpdated = (pair: string) => {
  const event = (state: TokenPairState) => ({
    ...state,
    currentPairData: (state.currentPair !== pair) ? null : state.currentPairData,
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
          active: pair.active,
          rank: pair.rank,
          listed: pair.listed,
          makeFee: pair.makeFee,
          relayerAddress: pair.relayerAddress,
          takeFee: pair.takeFee,
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

export const tokenPairDataUpdated = (tokenPairData: Array<TokenPairData>) => {
  const event = (state: TokenPairDataMap) => {

    const data = tokenPairData.reduce((result, item) => {
      return {
        ...result,
        [item.pair]: {
          ...state.data[item.pair],
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

export const updateSmallChartsData = (smallChartsData: Object) => {
  const event = (state) => {

    const newState = {
      ...state,
      smallChartsData,
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

export default function getTokenPairsDomain(state: TokenPairState) {
  return {
    loading: (): Boolean => state.loading,
    getPairs: (): any => Object.keys(state.byPair),
    getPair: (code: string): any => state.byPair[code],
    getPairsByCode: () => state.byPair,
    getPairsArray: () => Object.values(state.byPair),
    getTokenPairsData: () => state.data,
    getTokenPairsDataArray: () => Object.values(state.data),
    getFavoritePairs: () => state.favorites,
    getCurrentPair: (): TokenPair => state.currentPair || {},
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

    getSmallChartsData: () => {
      const { smallChartsData } = state
      if (!smallChartsData) return null

      const coins = Object.keys(smallChartsData)
      const newSmallChartsData = []

      for (let i = 0; i < coins.length; i++) {
        if (!smallChartsData[coins[i]] || smallChartsData[coins[i]].length === 0) return null
        const lengthPriceArray = smallChartsData[coins[i]].length
        const volume = +smallChartsData[coins[i]][0].totalVolume
        const closePrice = +smallChartsData[coins[i]][0].price
        const openPrice = +smallChartsData[coins[i]][lengthPriceArray - 1].price

        coins[i] = {
          data: JSON.parse(JSON.stringify(smallChartsData[coins[i]])).reverse(),
          price: smallChartsData[coins[i]][0].price,
          change: (closePrice - openPrice)*100/openPrice,
          volume,
          code: coins[i],
          fiatCurrency: smallChartsData[coins[i]][0].fiatCurrency,
        }

        newSmallChartsData.push(coins[i])
      }

      return newSmallChartsData
    },
  }
}
