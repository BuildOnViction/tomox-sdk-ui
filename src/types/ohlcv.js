//@flow

export type OHLCVState = {
  +ohlcvData: Object[],
  +currentTimeSpan: Object,
  +currentDuration: Object,
  +noOfCandles: number
}

export type SendTimelineParams = {
  updateWRT: string
}

export type SingleOrderTypes = {
  order: Object,
  index: number,
  decimals: number
}
