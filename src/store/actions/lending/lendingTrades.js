const actionTypes = {
  updateTradesByAddress: 'lendingTrades/UPDATE_TRADES_BY_ADDRESS',
}

export function updateTradesByAddress(trades) {
  return {
    type: actionTypes.updateTradesByAddress,
    payload: trades,
  }
}

export default actionTypes
