//@flow
import type { WebsocketMessage } from '../../../../types/websocket'
import { sendMessage } from './common'

export const subscribeLendingMarkets = () => {
  const message: WebsocketMessage = {
    channel: 'lending_markets',
    event: {
      type: 'SUBSCRIBE',
    },
  }

  return sendMessage(message)
}

export const unSubscribeLendingMarkets = () => {
  const message: WebsocketMessage = {
    channel: 'lending_markets',
    event: {
      type: 'UNSUBSCRIBE',
    },
  }

  return sendMessage(message)
}