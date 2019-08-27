const actionTypes = {
  ordersUpdatedStatus: 'orders/ORDER_UPDATED_STATUS',
}

export function ordersUpdatedStatus(status: Boolean) {
  return {
    type: actionTypes.ordersUpdatedStatus,
    payload: { status },
  }
}

export default actionTypes
