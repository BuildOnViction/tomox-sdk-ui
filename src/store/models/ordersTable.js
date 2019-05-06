// @flow
import * as appActionCreators from '../actions/app'
import { getOrdersDomain } from '../domains'
import type { State, ThunkAction } from '../../types'

import { parseCancelOrderError } from '../../config/errors'
import { getSigner } from '../services/signer'

export default function ordersTableSelector(state: State) {
  return {
    orders: () => getOrdersDomain(state).lastOrders(100),
  }
}

export const cancelOrder = (hash: string): ThunkAction => {
  return async (dispatch, getState, { socket }) => {
    try {
      const signer = getSigner()
      const orderCancelPayload = await signer.createOrderCancel(hash)

      dispatch(appActionCreators.addSuccessNotification({ message: `Cancelling order ...` }))
      socket.sendNewOrderCancelMessage(orderCancelPayload)
    } catch (error) {
      const message = parseCancelOrderError(error)
      return dispatch(appActionCreators.addErrorNotification({ message }))
    }
  }
}
