const actionTypes = {
  lendingOrdersInitialized: 'lendingOrders/LENDING_ORDERS_INITIALIZED',
  lendingOrdersUpdateLoading: 'lendingOrders/LENDING_ORDERS_UPDATE_LOADING',
}

export function lendingOrdersInitialized(orders) {
  return {
    type: actionTypes.lendingOrdersInitialized,
    payload: orders,
  }
}

export function lendingOrdersUpdateLoading(loading: Boolean) {
  return {
    type: actionTypes.lendingOrdersUpdateLoading,
    payload: loading,
  }
}

export default actionTypes
