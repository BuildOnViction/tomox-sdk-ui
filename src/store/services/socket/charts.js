//@flow
import type { TokenPair } from '../../../types/tokens'
import type { WebsocketMessage } from '../../../types/websocket'
import { sendMessage } from './common'

export const subscribeChart = (
  pair: TokenPair,
  timespan: string,
  duration: string,
) => {
  if (!window.socket) throw new Error('Socket connection not established')

  const now = Date.now()
  const lengthByDurationUnit = {
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    M: 30 * 24 * 60 * 60 * 1000,
    Y: 12 * 30 * 24 * 60 * 60 * 1000,
  }
  const nameByTimespanUnit = {
    m: 'min',
    h: 'hour',
    d: 'day',
    M: 'month',
  }

  const message: WebsocketMessage = {
    channel: 'ohlcv',
    event: {
      type: 'SUBSCRIBE',
      payload: {
        name: pair.pair,
        baseToken: pair.baseTokenAddress,
        quoteToken: pair.quoteTokenAddress,
        from:
          duration === 'Full'
            ? 0
            : Math.floor(
                (now -
                  Number(duration.slice(0, -1)) *
                    lengthByDurationUnit[duration.slice(-1)]) /
                  1000
              ),
        to: Math.floor(now / 1000),
        units: nameByTimespanUnit[timespan.slice(-1)],
        duration: Number(timespan.slice(0, -1)),
      },
    },
  }

  return sendMessage(message)
}

export const subscribeTvChart = (
  pair: TokenPair,
  duration: string,
  units: string,
  from: string,
  to: string,
) => {
  if (!window.socket) throw new Error('Socket connection not established')

  const message: WebsocketMessage = {
    channel: 'ohlcv',
    event: {
      type: 'SUBSCRIBE',
      payload: {
        name: pair.pair,
        baseToken: pair.baseTokenAddress,
        quoteToken: pair.quoteTokenAddress,
        duration,
        units,
        from,
        to,        
      },
    },
  }

  return sendMessage(message)
}

export const unsubscribeChart = () => {
  if (!window.socket) throw new Error('Socket connection not established')

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

  return sendMessage(message)
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

  return sendMessage(message)
}

export const unsubscribeTrades = () => {
  const message: WebsocketMessage = {
    channel: 'trades',
    event: { type: 'UNSUBSCRIBE' },
  }

  return sendMessage(message)
}
