//@flow
import { getTermSymbol, getTermByDay } from '../../../utils/helpers'

import type {
  TokenPair,
  TokenPairState,
} from '../../../types/tokens'

export const initialized = (customInitialState?: TokenPairState) => {
  const defaultInitialState: TokenPairState = {
    byPair: {},
    data: {},
    favorites: [],
    currentPair: null,
    currentPairData: null,
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
        const termByDay = getTermByDay(pair.term)
        const termSymbol = getTermSymbol(pair.term)
        const pairSymbol = `${termSymbol}/${pair.lendingTokenSymbol}`
        const pairValueAddress = `${pair.term}/${pair.lendingTokenAddress}`

        result[pairValueAddress] = {
          lendingTokenAddress: pair.lendingTokenAddress,
          lendingTokenDecimals: pair.lendingTokenDecimals,
          lendingTokenSymbol: pair.lendingTokenSymbol,
          termValue: pair.term,
          termSymbol,
          pair: pairSymbol,
          pairValueAddress,
          termByDay,
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
      currentPair: Object.values(byPair)[0],
    }
  }

  return event
}

// export const tokenPairsReset = (pairs: TokenPairs) => {
//   const event = (state: TokenPairState) => {
//     const byPair = pairs.reduce(
//       (result, pair) => {
//         const pairSymbol = getPairSymbol(pair.baseTokenSymbol, pair.quoteTokenSymbol)
//         result[pairSymbol] = {
//           pair: pairSymbol,
//           baseTokenSymbol: pair.baseTokenSymbol,
//           quoteTokenSymbol: pair.quoteTokenSymbol,
//           baseTokenAddress: pair.baseTokenAddress,
//           quoteTokenAddress: pair.quoteTokenAddress,
//           baseTokenDecimals: pair.baseTokenDecimals,
//           quoteTokenDecimals: pair.quoteTokenDecimals,
//           makeFee: pair.makeFee,
//           takeFee: pair.takeFee,
//           listed: pair.listed,
//           active: pair.active,
//           rank: pair.rank,
//         }

//         return result
//       },
//       {}
//     )

//     const sortedPairs = pairs.map(pair => {
//       const pairSymbol = getPairSymbol(pair.baseTokenSymbol, pair.quoteTokenSymbol)
//       return pairSymbol
//     })

//     return {
//       ...state,
//       byPair,
//       sortedPairs: [...new Set([...sortedPairs])],
//     }
//   }

//   return event
// }

// export const tokenPairRemoved = (pair: pairToken) => {
//   const event = (state: TokenPairState) => {
//     const newByPair = Object.keys(state.byPair)
//       .filter(pairName => pairName !== pair.pair)
//       .reduce((result, current) => {
//         result[current] = state.byPair[current]
//         return result
//       }, {})

//     return {
//       byPair: newByPair,
//     }
//   }

//   return event
// }

export const lendingPairsDataUpdated = (lendingPairsData) => {
  const event = (state) => {

    const data = lendingPairsData.reduce((result, item) => {
      return {
        ...result,
        [item.pairValueAddress]: {
          ...state.data[item.pairValueAddress],
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

export const tokenPairFavorited = (pair: string, favorited: boolean) => {
  const event = (state: TokenPairState): TokenPairState => {
    const newState = favorited
      ? [...state.favorites, pair]
      : state.favorites.filter(elem => elem !== pair)

    return {
      ...state,
      favorites: newState,
    }
  }

  return event
}

export const updateCurrentPairData = (data) => {
  const event = (state) => {
    return {
      ...state,
      currentPairData: data,
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
    getPairs: (): any => Object.values(state.byPair),
    getPair: (code: string): any => state.byPair[code],
    // getPairsByCode: () => state.byPair,
    getTokenPairsData: () => state.data,
    getTokenPairsDataArray: () => Object.values(state.data),
    getFavoritePairs: () => state.favorites,
    getCurrentPair: (): TokenPair => state.currentPair || {},
    getCurrentPairData: () => state.currentPairData,

    getTokenPairsWithDataArray: () => {
      const tokenPairData = []
      const valueAddressKeys = Object.keys(state.byPair)

      valueAddressKeys.forEach(valueAddress => {
        if (state.data[valueAddress] && state.byPair[valueAddress]) {
          tokenPairData.push({
            ...state.data[valueAddress],
            ...state.byPair[valueAddress],
          })
        }
      })

      return tokenPairData
    },
  }
}
