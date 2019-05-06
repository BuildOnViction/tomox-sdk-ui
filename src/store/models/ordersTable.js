// @flow
import * as appActionCreators from '../actions/app'
import { getOrdersDomain, getTradesDomain, getAccountDomain, getTokenPairsDomain } from '../domains'
import type { State, ThunkAction } from '../../types'

import { parseCancelOrderError } from '../../config/errors'
import { getSigner } from '../services/signer'

export default function ordersTableSelector(state: State) {
  const address = getAccountDomain(state).address()
  const orders = getOrdersDomain(state).lastOrders(100)
  const trades = getTradesDomain(state).userTrades(address)
  const currentPair = getTokenPairsDomain(state).getCurrentPair()

  return {
    orders,
    trades,
    currentPair,
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
