// @flow
import type { Orders, OrdersState } from '../../types/orders';
import { formatNumber } from 'accounting-js';
import { amountPrecision, pricePrecision } from '../../config/tokens';

const initialState = {
  byHash: {}
};

export const initialized = () => {
  const event = (state: OrdersState = initialState) => state;
  return event;
};

export function ordersInitialized(orders: Orders) {
  const event = (state: OrdersState) => {
    let newState = orders.reduce((result, item) => {
      result[item.hash] = {
        ...state[item.hash],
        ...item
      };
      return result;
    }, {});

    return { byHash: newState };
  };

  return event;
}

export function ordersUpdated(orders: Orders) {
  const event = (state: OrdersState) => {
    let newState = orders.reduce((result, item) => {
      result[item.hash] = {
        ...state[item.hash],
        ...item
      };
      return result;
    }, {});

    return {
      ...state,
      byHash: {
        ...state.byHash,
        ...newState
      }
    };
  };

  return event;
}

export const ordersDeleted = (hashes: Array<number>) => {
  const event = (state: OrdersState) => ({
    ...state,
    byHash: Object.keys(state.byHash)
      .filter(key => hashes.indexOf(key) === -1)
      .reduce((result, current) => {
        result[current] = state.byHash[current];
        return result;
      }, {})
  });

  return event;
};

const getOrders = (state: OrdersState): Orders => {
  return Object.keys(state.byHash).map(key => state.byHash[key]);
};

export default function ordersDomain(state: OrdersState) {
  return {
    byHash: () => state.byHash,
    all: () => getOrders(state),

    lastOrders: (n: number): Orders => {
      let orders: Orders = getOrders(state);
      orders = orders.slice(Math.max(orders.length - n, 0));
      orders = orders.map(order => {
        order.filled = formatNumber(order.filled, {
          precision: amountPrecision
        });
        order.amount = formatNumber(order.amount, {
          precision: amountPrecision
        });
        order.price = formatNumber(order.price, { precision: pricePrecision });
        order.cancellable =
          order.status === 'OPEN' || order.status === 'PARTIAL_FILLED';
        return order;
      });

      return orders;
    },

    history: (): Orders => {
      let orders: Orders = getOrders(state);
      let history = orders.filter(
        order =>
          ['CANCELLED', 'FILLED', 'PARTIALLY_FILLED'].indexOf(order.status) ===
          -1
      );
      return history;
    },

    current: (): Orders => {
      let orders: Orders = getOrders(state);
      let current = orders.filter(
        order => ['NEW', 'OPEN'].indexOf(order.status) === -1
      );
      return current;
    }
  };
}
