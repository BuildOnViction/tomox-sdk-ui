//@flow

import type { TokenPair } from './tokens'

export type OHLCVState = {
  +ohlcvData: Object[],
  +currentTimeSpan: Object,
  +currentDuration: Object,
  +noOfCandles: number,
}

export type SendTimelineParams = {
  updateWRT: string,
}

export type Candle = {
  open: string,
  high: string,
  close: string,
  low: string,
  volume: string,
  timestamp: number,
  pair: TokenPair,
}

export type Candles = Array<Candle>
