//@flow
import type { WebsocketMessage } from '../../../types/websocket'
import { sendMessage } from './common'

export const sendNewOrderMessage = async (orderPayload: Object) => {
  const message: WebsocketMessage = {
    channel: 'orders',
    event: {
      type: 'NEW_ORDER',
      hash: orderPayload.hash,
      payload: orderPayload,
    },
  }

  return sendMessage(message)
}

export const sendNewOrderCancelMessage = (orderCancelPayload: Object) => {
  const message: WebsocketMessage = {
    channel: 'orders',
    event: {
      type: 'CANCEL_ORDER',
      hash: orderCancelPayload.hash,
      payload: orderCancelPayload,
    },
  }

  return sendMessage(message)
}

export const sendNewSubmitSignatureMessage = (
  hash: string,
  order: Object,
  remainingOrder: Object,
  matches: Array<Object>,
) => {
  const message: WebsocketMessage = {
    channel: 'orders',
    event: {
      type: 'SUBMIT_SIGNATURE',
      hash,
      payload: { order, remainingOrder, matches },
    },
  }

  return sendMessage(message)
}
