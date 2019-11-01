// @flow
import * as appActionCreators from '../actions/app'
import { getOrdersDomain, getTradesDomain, getAccountDomain, getTokenPairsDomain } from '../domains'
import type { State, ThunkAction } from '../../types'

import { parseCancelOrderError } from '../../config/errors'
import { getSigner } from '../services/signer'

export default function ordersTableSelector(state: State) {
  const accountDomain = getAccountDomain(state)
  const address = accountDomain.address()
  const authenticated = accountDomain.authenticated()
  const orders = getOrdersDomain(state).lastOrders(100)
  const trades = getTradesDomain(state).userTrades(address)
  const currentPair = getTokenPairsDomain(state).getCurrentPair()

  return {
    orders,
    trades,
    currentPair,
    authenticated,
  }
}

export const cancelOrder = (hash: string): ThunkAction => {
  return async (dispatch, getState, { socket, api }) => {
    try {
      const state = getState()
      const order = getOrdersDomain(state).getOrderByHash(hash)
      const signer = getSigner()
      const userAddress = await signer.getAddress()
      order.nonce = await api.getOrderNonceByAddress(userAddress)
      const orderCancelPayload = await signer.createOrderCancel(order)

      dispatch(appActionCreators.addSuccessNotification({ message: `Cancelling order ...` }))
      socket.sendNewOrderCancelMessage(orderCancelPayload)
    } catch (error) {
      const message = parseCancelOrderError(error)
      return dispatch(appActionCreators.addErrorNotification({ message }))
    }
  }
}
