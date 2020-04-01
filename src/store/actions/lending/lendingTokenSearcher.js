const actionTypes = {
  updateFavorite: 'lendingTokenSearcher/UPDATE_FAVORITE',
  updateCurrentPair: 'lendingTokenSearcher/UPDATE_CURRENT_PAIR',
  updateTradesTable: 'lendingTokenSearcher/UPDATE_TRADES_TABLE',
  updateOrderBook: 'lendingTokenSearcher/UPDATE_ORDERBOOK',
}

export function updateFavorite(code: string, favorite: boolean) {
  return {
    type: actionTypes.updateFavorite,
    payload: { code, favorite },
  }
}

export function updateCurrentPair(pair: string) {
  return {
    type: actionTypes.updateCurrentPair,
    payload: pair,
  }
}

export function updateTradesTable(trades: Trades) {
  return {
    type: actionTypes.updateTradesTable,
    payload: trades,
  }
}

export function updateOrderBook(bids: Array<Object>, asks: Array<Object>) {
  return {
    type: actionTypes.updateOrderBook,
    payload: { bids, asks },
  }
}

export default actionTypes
