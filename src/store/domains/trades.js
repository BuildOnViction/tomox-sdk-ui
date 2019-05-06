// @flow
import { sortTable } from '../../utils/helpers'
import { formatNumber } from 'accounting-js'
import { amountPrecision, pricePrecision } from '../../config/tokens'

import type { Trade, Trades, TradesState } from '../../types/trades'

const initialState = {
  byHash: {},
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

    return { byHash: newState }
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

const getTrades = (state: TradesState): Trades => {
  return Object.keys(state.byHash).map(key => state.byHash[key])
}

export default function tradesDomain(state: TradesState) {
  return {
    byHash: () => state.byHash,
    all: () => getTrades(state),

    userTrades: (address: string) => {
      let trades = getTrades(state)
      const isUserTrade = (trade: Trade) =>
        trade.taker === address || trade.maker === address

      trades = trades.filter(trade => isUserTrade(trade))
      trades = sortTable(trades, 'time', 'desc')
      trades = trades.map(trade => {
        return {
          ...trade,
          amount: formatNumber(trade.amount, { precision: amountPrecision }),
          price: formatNumber(trade.price, { precision: pricePrecision }),
        }
      })

      return trades
    },

    marketTrades: (n: number): Trades => {
      let trades = getTrades(state)
      trades = sortTable(trades, 'time', 'desc')
      trades = trades.map((trade, index) => {
        let change

        index === trades.length - 1
          ? (change = 'positive')
          : trade.price >= trades[index + 1].price
          ? (change = 'positive')
          : (change = 'negative')

        return {
          ...trade,
          amount: formatNumber(trade.amount, { precision: amountPrecision }),
          price: formatNumber(trade.price, { precision: pricePrecision }),
          change,
        }
      })

      trades = (trades: Trades).slice(0, n)
      return trades
    },

    lastTrades: (n: number): Trades => {
      const trades = Object.values(state.byHash)
      const sortedTrades = sortTable(trades, 'time', 'desc')
      const lastTrades = (sortedTrades: Trades).slice(0, n)
      return lastTrades
    },
  }
}
