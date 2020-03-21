const actionTypes = {
  ordersInitialized: 'lendingOrders/ORDERS_INITIALIZED',
  lendingOrdersUpdateLoading: 'lendingOrders/LENDING_ORDERS_UPDATE_LOADING',
}

export function ordersInitialized(orders) {
  return {
    type: actionTypes.ordersInitialized,
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
