// @flow
import type { Trades, TradesState } from '../../types/trades';
import { passTimestamp } from '../../utils/helpers';

const initialState = {
  byTimestamp: {}
};

export const initialized = () => {
  const event = (state: TradesState = initialState) => state;
  return event;
};

// key may be Date, string, timestamp - number
export const tradesUpdated = (trades: Trades) => {
  const event = (state: TradesState) => {
    let newState = trades.reduce((result, item) => {
      const key = passTimestamp(item.time);
      result[key] = {
        ...state[item.time],
        ...item,
        time: key
      };
      return result;
    }, {});

    return {
      ...state,
      byTimestamp: {
        ...state.byTimestamp,
        ...newState
      }
    };
  };

  return event;
};

export const tradesDeleted = (trades: Trades) => {
  const event = (state: TradesState) => ({
    ...state,
    byTimestamp: Object.keys(state.byTimestamp)
      .filter(key => trades.indexOf(key) === -1)
      .reduce((result, current) => {
        result[current] = state.byTimestamp[current];
        return result;
      }, {})
  });

  return event;
};

export const tradesReset = () => {
  const event = (state: TradesState) => ({
    ...state,
    byTimeStamp: {}
  });

  return event;
};

const getTrades = (state: TradesState): Trades => {
  return Object.keys(state.byTimestamp).map(key => state.byTimestamp[key]);
};

export default function tradesDomain(state: TradesState) {
  return {
    byTimestamp: () => state.byTimestamp,

    all: () => getTrades(state),

    lastTrades: (n: number) => {
      let trades = getTrades(state);
      let last = (trades: Trades).slice(Math.max(trades.length - n, 1));
      return last;
    }
  };
}
