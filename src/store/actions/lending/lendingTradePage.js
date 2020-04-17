// @flow
export const actionTypes = {
  updateCurrentPair: 'lendingTradingPage/UPDATE_CURRENT_PAIR',
  initOrdersTable: 'lendingTradingPage/INIT_ORDERS_TABLE',
  updateOrdersTable: 'lendingTradingPage/UPDATE_ORDERS_TABLE',
  initOrderBook: 'lendingTradingPage/INIT_ORDERBOOK',
  updateOrderBook: 'lendingTradingPage/UPDATE_ORDERBOOK',
  initTradesTable: 'lendingTradingPage/INIT_TRADES_TABLE',
  updateTradesTable: 'lendingTradingPage/UPDATE_TRADES_TABLE',
  updateTradesByAddress: 'lendingTradingPage/UPDATE_TRADES_BY_ADDRESS',
  updateOHLCVLoading: 'lendingTradingPage/UPDATE_OHLCV_LOADING',
}

export function updateCurrentPair(pair: string): UpdateCurrentPairAction {
  return {
    type: actionTypes.updateCurrentPair,
    payload: pair,
  }
}

export function updateOrdersTable(orders: Orders): UpdateOrdersTableAction {
  return {
    type: actionTypes.updateOrdersTable,
    payload: { orders },
  }
}

export function updateTradesTable(trades: Trades): UpdateTradesTableAction {
  return {
    type: actionTypes.updateTradesTable,
    payload: { trades },
  }
}

export function updateOrderBook(
  bids: Array<Object>,
  asks: Array<Object>,
): UpdateOrderBookAction {
  return {
    type: actionTypes.updateOrderBook,
    payload: { bids, asks },
  }
}

export function initOrdersTable(orders: Orders): InitOrdersTableAction {
  return {
    type: actionTypes.initOrdersTable,
    payload: { orders },
  }
}

export function initTradesTable(trades: Trades): InitTradesTableAction {
  return {
    type: actionTypes.initTradesTable,
    payload: { trades },
  }
}

export function initOrderBook(
  bids: Array<Object>,
  asks: Array<Object>,
): InitOrderBookAction {
  return {
    type: actionTypes.initOrderBook,
    payload: { bids, asks },
  }
}

export function updateTradesByAddress(trades: any) {
  return {
    type: actionTypes.updateTradesByAddress,
    payload: { trades },
  }
}

export function updateOHLCVLoading(loading: boolean): UpdateOHLCVLoading {
  return {
    type: actionTypes.updateOHLCVLoading,
    payload: loading,
  }
}

export default actionTypes
