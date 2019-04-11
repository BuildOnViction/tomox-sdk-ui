import type { WebsocketMessage } from '../../../types/websocket'
import { sendMessage } from './common'

export const subscribePrice = (pair: TokenPair) => {
    const message: WebsocketMessage = {
        channel: 'price_board',
        event: {
            type: 'SUBSCRIBE',
            payload: {
                name: pair.pair,
                baseToken: pair.baseTokenAddress,
                quoteToken: pair.quoteTokenAddress,
            },
        },
    }
  
    return sendMessage(message)
}

export const unSubscribePrice = () => {
    const message: WebsocketMessage = {
        channel: 'price_board',
        event: {
            type: 'UNSUBSCRIBE',
        },
    }
  
    return sendMessage(message)
}