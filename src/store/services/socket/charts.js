//@flow
import type { TokenPair } from '../../../types/tokens'
import type { WebsocketMessage } from '../../../types/websocket'
import { sendMessage } from './common'

import { addMonths } from 'date-fns'

export const subscribeChart = (
  pair: TokenPair,
  from: number,
  to: number,
  duration: number,
  units: string
) => {
  const now = Date.now()
  duration = duration || 5
  units = units || 'sec'
  from = from || Math.floor(addMonths(new Date(now), -2).getTime() / 1000)
  to = to || Math.floor(new Date(now).getTime() / 1000)

  const message: WebsocketMessage = {
    channel: 'ohlcv',
    event: {
      type: 'SUBSCRIBE',
      payload: {
        name: pair.pair,
        baseToken: pair.baseTokenAddress,
        quoteToken: pair.quoteTokenAddress,
        from,
        to,
        units,
        duration,
      },
    },
  }

  return sendMessage(message).then(() => unsubscribeChart())
}

export const unsubscribeChart = () => {
  const message: WebsocketMessage = {
    channel: 'ohlcv',
    event: {
      type: 'UNSUBSCRIBE',
    },
  }

  return sendMessage(message)
}

export const subscribeOrderBook = (pair: TokenPair) => {
  const message: WebsocketMessage = {
    channel: 'orderbook',
    event: {
      type: 'SUBSCRIBE',
      payload: {
        name: pair.pair,
        baseToken: pair.baseTokenAddress,
        quoteToken: pair.quoteTokenAddress,
      },
    },
  }

  return sendMessage(message).then(() => unsubscribeOrderBook())
}

export const unsubscribeOrderBook = () => {
  const message: WebsocketMessage = {
    channel: 'orderbook',
    event: { type: 'UNSUBSCRIBE' },
  }

  return sendMessage(message)
}

export const subscribeTrades = (pair: TokenPair) => {
  const message: WebsocketMessage = {
    channel: 'trades',
    event: {
      type: 'SUBSCRIBE',
      payload: {
        name: pair.pair,
        baseToken: pair.baseTokenAddress,
        quoteToken: pair.quoteTokenAddress,
      },
    },
  }

  return sendMessage(message).then(() => unsubscribeTrades())
}

export const unsubscribeTrades = () => {
  const message: WebsocketMessage = {
    channel: 'trades',
    event: { type: 'UNSUBSCRIBE' },
  }

  return sendMessage(message)
}
