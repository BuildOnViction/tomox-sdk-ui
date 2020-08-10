// @flow
import BigNumber from 'bignumber.js'

import type { Orders, OrdersState } from '../../types/orders'

const initialState = {
  loading: false,
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

    return { 
      ...state,
      byHash: newState,
    }
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

export function ordersUpdatedStatus(status: Boolean) {
  const event = (state: OrdersState) => {
    return {
      ...state,
      loading: status,
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

export const ordersReset = () => {
  const event = _ => initialState
  return event
}

const getOrders = (state: OrdersState): Orders => {
  const orders = Object.keys(state.byHash).map(key => state.byHash[key])
  return JSON.parse(JSON.stringify(orders))
}

export default function ordersDomain(state: OrdersState) {
  return {
    byHash: () => state.byHash,
    all: () => getOrders(state),
    loading: () => state.loading,

    lastOrders: (n: number): Orders => {
      let orders: Orders = getOrders(state)
      orders = orders.slice(Math.max(orders.length - n, 0))
      orders = orders.map(order => {
        const filledPercent = order.filled ? BigNumber(order.filled).times(100).div(order.amount) : 0
        const total = BigNumber(order.price).times(order.amount).toNumber()
        const filled = order.filled
        const amount = order.amount
        const price = order.price
        const cancelAble = (order.status === 'OPEN' || order.status === 'PARTIAL_FILLED') && (order.orderID !== '0')
        return { ...order, filledPercent, total, filled, amount, price, cancelAble }
      })

      return orders
    },

    history: (): Orders => {
      const orders: Orders = getOrders(state)
      const history = orders.filter(
        order =>
          ['CANCELLED', 'FILLED', 'PARTIALLY_FILLED'].indexOf(order.status) === 1
      )
      return history
    },

    current: (): Orders => {
      const orders: Orders = getOrders(state)
      const current = orders.filter(
        order => ['NEW', 'OPEN'].indexOf(order.status) === 1
      )
      return current
    },
    getOrderByHash: (hash) => state.byHash[hash],
  }
}