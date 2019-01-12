// @flow
import { formatNumber } from 'accounting-js'

import type { Orders, OrdersState } from '../../types/orders'
import { getBaseToken, getQuoteToken } from '../../utils/tokens'
import { amountPrecision, pricePrecision } from '../../config/tokens'

const initialState = {
  byHash: {},
}

export const initialized = () => {
  const event = (state: OrdersState = initialState) => state
  return event
}

export function ordersInitialized(orders: Orders) {
  const event = (state: OrdersState) => {
    const newState = orders.reduce((result, item) => {
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

export function ordersUpdated(orders: Orders) {
  const event = (state: OrdersState) => {
    const newState = orders.reduce((result, item) => {
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

export const ordersDeleted = (hashes: Array<number>) => {
  const event = (state: OrdersState) => ({
    ...state,
    byHash: Object.keys(state.byHash)
      .filter(key => hashes.indexOf(key) === -1)
      .reduce((result, current) => {
        result[current] = state.byHash[current]
        return result
      }, {}),
  })

  return event
}

const getOrders = (state: OrdersState): Orders => {
  return Object.keys(state.byHash).map(key => state.byHash[key])
}

export default function ordersDomain(state: OrdersState) {
  return {
    byHash: () => state.byHash,
    all: () => getOrders(state),

    lastOrders: (n: number): Orders => {
      let orders: Orders = getOrders(state)
      orders = orders.slice(Math.max(orders.length - n, 0))
      orders = orders.map(order => {
        order.filled = formatNumber(order.filled, {
          precision: amountPrecision,
        })
        order.amount = formatNumber(order.amount, {
          precision: amountPrecision,
        })
        order.price = formatNumber(order.price, { precision: pricePrecision })
        order.cancellable =
          order.status === 'OPEN' || order.status === 'PARTIAL_FILLED'
        return order
      })

      return orders
    },

    lockedBalanceByToken: (symbol: string, address: string) => {
      const orders = Object.values(state.byHash)
      let lockedBalance = 0

      orders.forEach(order => {
        if (symbol === getBaseToken(order.pair) && order.side === 'SELL') {
          if (['NEW', 'OPEN', 'PARTIALLY_FILLED'].indexOf(order.status) !== -1) {
            lockedBalance = lockedBalance + (order.amount - order.filled)
          }
        }

        if (symbol === getQuoteToken(order.pair) && order.side === 'BUY') {
          if (['NEW', 'OPEN', 'PARTIALLY_FILLED'].indexOf(order.status) !== -1) {
            lockedBalance = lockedBalance + (order.amount - order.filled) * order.price
          }
        }
      })

      return lockedBalance
    },

    history: (): Orders => {
      const orders: Orders = getOrders(state)
      const history = orders.filter(
        order =>
          ['CANCELLED', 'FILLED', 'PARTIALLY_FILLED'].indexOf(order.status) ===
          -1,
      )
      return history
    },

    current: (): Orders => {
      const orders: Orders = getOrders(state)
      const current = orders.filter(
        order => ['NEW', 'OPEN'].indexOf(order.status) === -1,
      )
      return current
    },
  }
}
