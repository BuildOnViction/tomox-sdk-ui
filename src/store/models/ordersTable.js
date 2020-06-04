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
  const currentPairData = getTokenPairsDomain(state).getCurrentPairData()

  return {
    orders,
    trades,
    currentPair,
    currentPairData,
    authenticated,
  }
}

export const cancelOrder = (hash: string): ThunkAction => {
  return async (dispatch, getState, { socket, api }) => {
    try {
      const state = getState()
      const order = getOrdersDomain(state).getOrderByHash(hash)
      const accountDomain = getAccountDomain(state)
      const userAddress = accountDomain.address()
      const exchangeAddress = accountDomain.exchangeAddress()
      order.nonce = await api.getOrderNonceByAddress(userAddress)
      const orderCancelPayload = await getSigner().createOrderCancel({...order, status: 'CANCELLED', userAddress, exchangeAddress})

      dispatch(appActionCreators.addSuccessNotification({ notificationType: 'orderCancelling', message: `Cancelling order ...` }))
      socket.sendNewOrderCancelMessage(orderCancelPayload)
    } catch (error) {
      const message = parseCancelOrderError(error)
      return dispatch(appActionCreators.addErrorNotification({ message }))
    }
  }
}
