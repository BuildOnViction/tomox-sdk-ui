const actionTypes = {
  subscribeBalance: 'tomoBalance/SUBSCRIBE_BALANCE',
  updateBalance: 'tomoBalance/UPDATE_BALANCE',
  unsubscribeBalance: 'tomoBalance/UNSUBSCRIBE_BALANCE'
}

export function subscribeBalance(address) {
  return {
    type: actionTypes.subscribeBalance,
    payload: { address }
  }
}

export function updateBalance(address, balance) {
  return {
    type: actionTypes.updateBalance,
    payload: { address, balance }
  }
}

export function unsubscribeBalance(address) {
  return {
    type: actionTypes.unsubscribeBalance,
    payload: { address }
  }
}

export default actionTypes
