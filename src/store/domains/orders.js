// @flow
import type { Orders, OrdersState } from '../../types/orders'

const initialState = {
  byTimestamp: {}
}

export const initialized = () => {
  const event = (state: OrdersState = initialState) => state
  return event
}

export function ordersUpdated(orders: Orders) {
  const event = (state: OrdersState) => {
    let newState = orders.reduce((result, item) => {
      result[item.time] = {
        ...state[item.time],
        ...item
      }
      return result
    }, {})

    return {
      ...state,
      byTimestamp: {
        ...state.byTimestamp,
        ...newState
      }
    }
  }

  return event
}

export const ordersDeleted = (timestamps: Array<number>) => {
  const event = (state: OrdersState) => ({
    ...state,
    byTimestamp: Object.keys(state.byTimestamp)
      .filter(key => timestamps.indexOf(key) === -1)
      .reduce((result, current) => {
        result[current] = state.byTimestamp[current]
        return result
      }, {})
  })

  return event
}

const getOrders = (state: OrdersState): Orders => {
  return Object.keys(state.byTimestamp).map(key => state.byTimestamp[key])
}

export default function ordersDomain(state: OrdersState) {
  return {
    byTimestamp: () => state.byTimestamp,
    all: () => getOrders(state),

    lastOrders: (n: number) => {
      let orders = getOrders(state)
      let last = (orders: Orders).slice(Math.max(orders.length - n, 1))
      return last
    },
    history: () => {
      let orders = getOrders(state)
      let history = (orders: Orders).filter(
        order => ['CANCELLED', 'FILLED', 'PARTIALLY_FILLED'].indexOf(order.status) === -1
      )
      return history
    },

    current: () => {
      let orders = getOrders(state)
      let current = (orders: Orders).filter(order => ['NEW', 'OPEN'].indexOf(order.status) === -1)
      return current
    }
  }
}
