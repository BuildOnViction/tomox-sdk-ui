// @flow
import { sortTable } from '../../utils/helpers'
import { formatNumber } from 'accounting-js'
import { amountPrecision, pricePrecision } from '../../config/tokens'

import type { Trade, Trades, TradesState } from '../../types/trades'

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
    return Object.keys(state.byAddress).map(key => state.byAddress[key])
  }

  return Object.keys(state.byHash).map(key => state.byHash[key])
}

export default function tradesDomain(state: TradesState) {
  return {
    byHash: () => state.byHash,
    all: () => getTrades(state),

    userTrades: (address: string) => {
      let trades = getTrades(state, 'address')
      const isUserTrade = (trade: Trade) =>
        trade.taker === address || trade.maker === address

      trades = trades.filter(trade => isUserTrade(trade))
      trades = sortTable(trades, 'time', 'desc')
      trades = trades.map(trade => {
        return {
          ...trade,
          amount: formatNumber(trade.amount, { precision: amountPrecision }),
          price: formatNumber(trade.price, { precision: pricePrecision }),
          total: formatNumber(trade.price * trade.amount, { precision: pricePrecision }),
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
          amount: formatNumber(trade.amount, { precision: amountPrecision }),
          price: formatNumber(trade.price, { precision: pricePrecision }),
        }
      })

      trades = (trades: Trades).slice(0, n)
      return trades
    },
  }
}
