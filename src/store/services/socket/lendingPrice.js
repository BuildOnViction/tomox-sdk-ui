import type { WebsocketMessage } from '../../../types/websocket'
import { sendMessage } from './common'

export const subscribeLendingPrice = ({term, lendingToken}) => {
    const message: WebsocketMessage = {
        channel: 'lending_price_board',
        event: {
            type: 'SUBSCRIBE',
            payload: {
                term,
                lendingToken,
            },
        },
    }
  
    return sendMessage(message)
}

export const unSubscribeLendingPrice = () => {
    const message: WebsocketMessage = {
        channel: 'lending_price_board',
        event: {
            type: 'UNSUBSCRIBE',
        },
    }
  
    return sendMessage(message)
}