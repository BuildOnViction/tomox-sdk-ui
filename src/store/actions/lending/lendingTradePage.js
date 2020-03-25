// @flow
export const actionTypes = {
  updateCurrentPair: 'tradingPage/UPDATE_CURRENT_PAIR',
  // initOrdersTable: 'tradingPage/INIT_ORDERS_TABLE',
  // updateOrdersTable: 'tradingPage/UPDATE_ORDERS_TABLE',
  // initOrderBook: 'tradingPage/INIT_ORDERBOOK',
  // updateOrderBook: 'tradingPage/UPDATE_ORDERBOOK',
  // initTradesTable: 'tradingPage/INIT_TRADES_TABLE',
  // updateTradesTable: 'tradingPage/UPDATE_TRADES_TABLE',
  // updateTradesByAddress: 'tradingPage/UPDATE_TRADES_BY_ADDRESS',
  // updateOHLCVLoading: 'tradingPage/UPDATE_OHLCV_LOADING',
}

export function updateCurrentPair(pair: string): UpdateCurrentPairAction {
  return {
    type: actionTypes.updateCurrentPair,
    payload: pair,
  }
}

// export function updateOrdersTable(orders: Orders): UpdateOrdersTableAction {
//   return {
//     type: actionTypes.updateOrdersTable,
//     payload: { orders },
//   }
// }

// export function updateTradesTable(trades: Trades): UpdateTradesTableAction {
//   return {
//     type: actionTypes.updateTradesTable,
//     payload: { trades },
//   }
// }

// export function updateOrderBook(
//   bids: Array<Object>,
//   asks: Array<Object>,
// ): UpdateOrderBookAction {
//   return {
//     type: actionTypes.updateOrderBook,
//     payload: { bids, asks },
//   }
// }

// export function initOrdersTable(orders: Orders): InitOrdersTableAction {
//   return {
//     type: actionTypes.initOrdersTable,
//     payload: { orders },
//   }
// }

// export function initTradesTable(trades: Trades): InitTradesTableAction {
//   return {
//     type: actionTypes.initTradesTable,
//     payload: { trades },
//   }
// }

// export function initOrderBook(
//   bids: Array<Object>,
//   asks: Array<Object>,
// ): InitOrderBookAction {
//   return {
//     type: actionTypes.initOrderBook,
//     payload: { bids, asks },
//   }
// }

// export function updateTradesByAddress(trades: any) {
//   return {
//     type: actionTypes.updateTradesByAddress,
//     payload: { trades },
//   }
// }

// export function updateOHLCVLoading(loading: boolean): UpdateOHLCVLoading {
//   return {
//     type: actionTypes.updateOHLCVLoading,
//     payload: { loading },
//   }
// }

export default actionTypes
