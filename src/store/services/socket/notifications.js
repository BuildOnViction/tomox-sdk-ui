import type { WebsocketMessage } from '../../../types/websocket'
import { sendMessage } from './common'

export const subscribeNotification = (address) => {
    const message: WebsocketMessage = {
        channel: 'notification',
        event: {
            type: 'SUBSCRIBE',
            payload: address,
        },
    }
  
    return sendMessage(message)
}

export const unSubscribeNotification = () => {
    const message: WebsocketMessage = {
        channel: 'notification',
        event: {
            type: 'UNSUBSCRIBE',
        },
    }
  
    return sendMessage(message)
}