//@flow
import type { TokenPair } from '../../../types/tokens'
import type { WebsocketMessage } from '../../../types/websocket'
import { sendMessage } from './common'

export const subscribeLendingChart = (
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
    channel: 'lending_ohlcv',
    event: {
      type: 'SUBSCRIBE',
      payload: {
        term: Number(pair.term),
        lendingToken: pair.lendingToken,
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

export const unsubscribeLendingChart = () => {
  if (!window.socket) throw new Error('Socket connection not established')

  const message: WebsocketMessage = {
    channel: 'lending_ohlcv',
    event: {
      type: 'UNSUBSCRIBE',
    },
  }

  return sendMessage(message)
}
