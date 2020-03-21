const actionTypes = {
  tradesByAddressInitialized: 'lendingTrades/TRADES_BY_ADDRESS_INITIALIZED',
}

export function tradesByAddressInitialized(trades) {
  return {
    type: actionTypes.tradesByAddressInitialized,
    payload: trades,
  }
}

export default actionTypes
