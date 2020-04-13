//@flow
import type { WebsocketMessage } from '../../../types/websocket'
import { sendMessage } from './common'

export const subscribeLendingOrders = async (userAddress: string) => {
  if (!window.socket) throw new Error('Socket connection not established')

  const message: WebsocketMessage = {
    channel: 'lending_orders',
    event: {
      type: 'SUBSCRIBE',
      payload: userAddress,
    },
  }

  return sendMessage(message)
}

export const unSubscribeLendingOrders = async () => {
  if (!window.socket) throw new Error('Socket connection not established')

  const message: WebsocketMessage = {
    channel: 'lending_orders',
    event: {
      type: 'UNSUBSCRIBE',
    },
  }

  return sendMessage(message)
}

export const sendNewLendingOrderMessage = async (order: Object) => {
  if (!window.socket) throw new Error('Socket connection not established')

  const message: WebsocketMessage = {
    channel: 'lending_orders',
    event: {
      type: 'NEW_LENDING_ORDER',
      payload: order,
    },
  }

  return sendMessage(message)
}
