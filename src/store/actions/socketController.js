// @flow
import type {
  Orders,
} from '../../types/orders'
import type {
  Trades,
} from '../../types/trades'
import type {
  CreateConnectionAction,
  OpenConnectionAction,
  CloseConnectionAction,
  ConnectionErrorAction,
  InitOrdersTableAction,
  UpdateOrdersTableAction,
  InitTradesTableAction,
  UpdateTradesTableAction,
  SubscribeOrderBookAction,
  UnsubscribeOrderBookAction,
  SubscribeOHLCVAction,
  UnsubscribeOHLCVAction,
  InitOHLCVAction,
  UpdateOHLCVAction,
  InitOrderBookAction,
  UpdateOrderBookAction,
} from '../../types/socketController'
import type {
  TokenPairs,
} from '../../types/tokens'

const actionTypes = {
  createConnection: 'socketController/CREATE_CONNECTION',
  closeConnection: 'socketController/CLOSE_CONNECTION',
  connectionError: 'socketController/CONNECTION_ERROR',
  openConnection: 'socketController/OPEN_CONNECTION',

  initTradesTable: 'socketController/INIT_TRADES_TABLE',
  updateTradesTable: 'socketController/UPDATE_TRADES_TABLE',
  updateTradesByAddress: 'socketController/UPDATE_TRADES_BY_ADDRESS',
  initOrdersTable: 'socketController/INIT_ORDERS_TABLE',
  updateOrdersTable: 'socketController/UPDATE_ORDERS_TABLE',

  subscribeOHLCV: 'socketController/SUBSCRIBE_OHLCV',
  unsubscribeOHLCV: 'socketController/UNSUBSCRIBE_OHLCV',
  initOHLCV: 'socketController/INIT_OHLCV',
  updateOHLCV: 'socketController/UPDATE_OHLCV',
  updateOHLCVLoading: 'socketController/UPDATE_OHLCV_LOADING',

  subscribeOrderbook: 'socketController/SUBSCRIBE_ORDERBOOK',
  unsubscribeOrderbook: 'socketController/UNSUBSCRIBE_ORDERBOOK',
  initOrderBook: 'socketController/INIT_ORDERBOOK',
  updateOrderBook: 'socketController/UPDATE_ORDERBOOK',

  updateTokenPairData: 'socketController/UPDATE_TOKEN_PAIR_DATA',
  updateSmallChartsData: 'socketController/UPDATE_SMALL_CHARTS_DATA',
  updateLoadingTokenPair: 'socketController/UPDATE_LOADING_TOKEN_PAIR',

  updateNewNotifications: 'socketController/UPDATE_NEW_NOTIFICATIONS',

  // LENDING
  initLendingOrderBook: 'socketController/INIT_LENDING_ORDERBOOK',
  updateLendingOrderBook: 'socketController/UPDATE_LENDING_ORDERBOOK',

  initLendingTradesTable: 'socketController/INIT_LENDING_TRADES_TABLE',
  updateLendingTradesTable: 'socketController/UPDATE_LENDING_TRADES_TABLE',
  updateLendingTradesByAddress: 'socketController/UPDATE_LENDING_TRADES_BY_ADDRESS',

  updateLendingPairsData: 'socketController/UPDATE_LENDING_PAIRS_DATA',

  updateLendingOrders: 'socketController/UPDATE_LENDING_ORDERS',
}

export function createConnection(): CreateConnectionAction {
  return {
    type: actionTypes.createConnection,
  }
}

export function connectionError(): ConnectionErrorAction {
  return {
    type: actionTypes.connectionError,
  }
}

export function openConnection(): OpenConnectionAction {
  return {
    type: actionTypes.openConnection,
  }
}

export function closeConnection(): CloseConnectionAction {
  return {
    type: actionTypes.closeConnection,
  }
}

// ORDERS TABLE ACTIONS
// TODO add subscribtions ?
export function initOrdersTable(orders: Orders): InitOrdersTableAction {
  return {
    type: actionTypes.initOrdersTable,
    payload: {
      orders,
    },
  }
}

export function updateOrdersTable(orders: Orders): UpdateOrdersTableAction {
  return {
    type: actionTypes.updateOrdersTable,
    payload: {
      orders,
    },
  }
}

// TRADES TABLE ACTIONS
// TODO add subscribtions ?
export function initTradesTable(trades: Trades): InitTradesTableAction {
  return {
    type: actionTypes.initTradesTable,
    payload: {
      trades,
    },
  }
}

export function updateTradesTable(trades: Trades): UpdateTradesTableAction {
  return {
    type: actionTypes.updateTradesTable,
    payload: {
      trades,
    },
  }
}

export function updateTradesByAddress(trades: Trades): UpdateTradesTableAction {
  return {
    type: actionTypes.updateTradesByAddress,
    payload: {
      trades,
    },
  }
}

// CHART ACTIONS
export function subscribeOHLCV(pair: string): SubscribeOHLCVAction {
  return {
    type: actionTypes.subscribeOHLCV,
    payload: {
      pair,
    },
  }
}

export function unsubscribeOHLCV(pair: string): UnsubscribeOHLCVAction {
  return {
    type: actionTypes.unsubscribeOHLCV,
    payload: {
      pair,
    },
  }
}

export function initOHLCV(data: Array<Object>): InitOHLCVAction {
  return {
    type: actionTypes.initOHLCV,
    payload: {
      data,
    },
  }
}

export function updateOHLCV(data: Array<Object>): UpdateOHLCVAction {
  return {
    type: actionTypes.updateOHLCV,
    payload: {
      data,
    },
  }
}

export function updateOHLCVLoading(loading: boolean) {
  return {
    type: actionTypes.updateOHLCVLoading,
    payload: { loading },
  }
}

// ORDERBOOK ACTIONS
export function subscribeOrderBook(pair: string): SubscribeOrderBookAction {
  return {
    type: actionTypes.subscribeOrderbook,
    payload: {
      pair,
    },
  }
}

export function unsubscribeOrderBook(pair: string): UnsubscribeOrderBookAction {
  return {
    type: actionTypes.unsubscribeOrderbook,
    payload: {
      pair,
    },
  }
}

export function initOrderBook(bids: Array<Object>, asks: Array<Object>): InitOrderBookAction {
  return {
    type: actionTypes.initOrderBook,
    payload: { bids, asks },
  }
}

export function updateOrderBook(bids: Array<Object>, asks: Array<Object>): UpdateOrderBookAction {
  return {
    type: actionTypes.updateOrderBook,
    payload: { bids, asks },
  }
}

// TOKENPAIR
export function updateTokenPairData(tokenPairData: TokenPairs): UpdateTokenPairDataAction {
  return {
    type: actionTypes.updateTokenPairData,
    payload: { tokenPairData },
  }
}

export function updateSmallChartsData(smallChartsData: Object) {
  return {
    type: actionTypes.updateSmallChartsData,
    payload: { smallChartsData },
  }
}

export function updateLoadingTokenPair(loading: Boolean) {
  return {
    type: actionTypes.updateLoadingTokenPair,
    payload: {loading},
  }
} 

// NOTIFICATION ACTIONS
export function updateNewNotifications() {
  return {
    type: actionTypes.updateNewNotifications,
  }
}

export function initLendingOrderBook(bids: Array<Object>, asks: Array<Object>) {
  return {
    type: actionTypes.initLendingOrderBook,
    payload: { bids, asks },
  }
}

export function updateLendingOrderBook(bids: Array<Object>, asks: Array<Object>) {
  return {
    type: actionTypes.updateLendingOrderBook,
    payload: { bids, asks },
  }
}

export function initLendingTradesTable(trades) {
  return {
    type: actionTypes.initLendingTradesTable,
    payload: {
      trades,
    },
  }
}

export function updateLendingTradesTable(trades) {
  return {
    type: actionTypes.updateLendingTradesTable,
    payload: {
      trades,
    },
  }
}

export function updateLendingTradesByAddress(trades) {
  return {
    type: actionTypes.updateLendingTradesByAddress,
    payload: trades,
  }
}

export function updateLendingPairsData(lendingPairsData) {
  return {
    type: actionTypes.updateLendingPairsData,
    payload: {
      lendingPairsData,
    },
  }
}

export function updateLendingOrders(order: Array<Object>) {
  return {
    type: actionTypes.updateLendingOrders,
    payload: order,
  }
}

export default actionTypes
