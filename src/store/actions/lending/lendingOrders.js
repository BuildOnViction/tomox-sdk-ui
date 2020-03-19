const actionTypes = {
  lendingOrdersUpdateLoading: 'lendingOrders/LENDING_ORDERS_UPDATE_LOADING',
}

export function lendingOrdersUpdateLoading(loading: Boolean) {
  return {
    type: actionTypes.lendingOrdersUpdateLoading,
    payload: loading,
  }
}

export default actionTypes
