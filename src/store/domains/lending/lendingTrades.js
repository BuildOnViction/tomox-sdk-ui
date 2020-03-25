// @flow
import BigNumber from 'bignumber.js'
import { sortTable } from '../../../utils/helpers'

import type { Trade, Trades, TradesState } from '../../../types/trades'

const initialState = {
  byHash: {},
  byAddress: {},
}

export const initialized = () => {
  const event = (state: TradesState = initialState) => state
  return event
}

export const tradesUpdated = (trades: Trades) => {
  const event = (state: TradesState) => {
    const newState = trades.reduce((result, item) => {
      result[item.hash] = {
        ...state[item.hash],
        ...item,
      }
      return result
    }, {})

    return {
      ...state,
      byHash: {
        ...state.byHash,
        ...newState,
      },
    }
  }

  return event
}

export const tradesByAddressUpdated = (trades: Trades) => {
  const event = (state: TradesState) => {
    const newState = trades.reduce((result, item) => {
      result[item.hash] = {
        ...state[item.hash],
        ...item,
      }
      return result
    }, {})

    return {
      ...state,
      byAddress: {
        ...state.byAddress,
        ...newState,
      },
    }
  }

  return event
}

export const tradesDeleted = (trades: Trades) => {
  const event = (state: TradesState) => ({
    ...state,
    byHash: Object.keys(state.byHash)
      .filter(key => trades.indexOf(key) === -1)
      .reduce((result, current) => {
        result[current] = state.byHash[current]
        return result
      }, {}),
  })

  return event
}

export const tradesInitialized = (trades: Trades) => {
  const event = (state: TradesState) => {
    const newState = trades.reduce((result, item) => {
      result[item.hash] = {
        ...state[item.hash],
        ...item,
      }
      return result
    }, {})

    return { 
      ...state,
      byHash: newState,
    }
  }

  return event
}

export const resetTradesByAddress = () => {
  const event = (state: TradesState) => {
    return {
      ...state,
      byAddress: {},
    }
  }

  return event
}

export const tradesReset = () => {
  const event = (state: TradesState) => {
    return {
      ...state,
      byHash: {},
    }
  }

  return event
}

const getTrades = (state: TradesState, type: string): Trades => {
  if (type === 'address') {
    return Object.values(state.byAddress)
  }

  return Object.values(state.byHash)
}

export default function tradesDomain(state: TradesState) {
  return {
    byHash: () => state.byHash,
    byAddress: () => state.byAddress,
    all: () => getTrades(state),

    userTrades: (address: string) => {
      let trades = getTrades(state, 'address')
      const isUserTrade = (trade: Trade) =>
        trade.borrower.toLowerCase() === address.toLowerCase() 
        || trade.investor.toLowerCase() === address.toLowerCase()

      trades = trades.filter(trade => isUserTrade(trade))
      trades = sortTable(trades, 'time', 'desc')
      trades = trades.map(trade => {
        return {
          ...trade,
          amount: trade.amount,
          price: trade.price,
          total: BigNumber(trade.price).times(trade.amount).toFormat(),
        }
      })

      return trades
    },

    marketTrades: (n: number): Trades => {
      let trades = getTrades(state)
      trades = sortTable(trades, 'time', 'desc')
      trades = trades.map((trade, index) => {

        return {
          ...trade,
          amount: trade.amount,
          price: trade.price,
        }
      })

      trades = (trades: Trades).slice(0, n)
      return trades
    },
  }
}
