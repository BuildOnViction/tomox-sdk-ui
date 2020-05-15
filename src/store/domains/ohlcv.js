// @flow
import type { OHLCVState } from '../../types/ohlcv'

const initialState: OHLCVState = {
  ohlcvData: [],
  noOfCandles: 150,
  currentTimeSpan: { name: '1 hr', label: '1h', value: '60' },
  currentDuration: { name: '2 Month', label: '2M' },
  loading: false,
}

export const initialized = () => {
  const event = (state: OHLCVState = initialState) => state

  return event
}

export const savedOHLCVData = (ohlcv: Object[]) => {
  const event = (state: OHLCVState) => ({
    ...state,
    ohlcvData: ohlcv,
  })
  return event
}

export const updateOHLCVData = (ohlcv: Object[]) => {
  const event = (state: OHLCVState): OHLCVState => ({
    ...state,
    ohlcvData: state.ohlcvData.concat(ohlcv),
  })
  return event
}

export const savedTimeSpan = (currentTimeSpan: Object) => {
  const event = (state: OHLCVState) => ({
    ...state,
    currentTimeSpan,
  })
  return event
}

export const savedDuration = (currentDuration: Object) => {
  const event = (state: OHLCVState) => ({
    ...state,
    currentDuration,
  })
  return event
}

export const savedNoOfCandles = (noOfCandles: Object) => {
  const event = (state: OHLCVState) => ({
    ...state,
    noOfCandles,
  })
  return event
}

export const ohlcvReset = () => {
  const event = (state: OHLCVState) => ({
    ...state,
    ohlcvData: [],
  })

  return event
}

export const updateOHLCVLoading = (loading: boolean) => {
  const event = (state: OHLCVState): OHLCVState => ({
    ...state,
    loading,
  })
  return event
}

export default function model(state: OHLCVState) {
  return {
    getState: () => state,
    getNoOfCandles: () => state.noOfCandles,
    getOHLCVData: () => state.ohlcvData,
    getLoading: () => state.loading,
  }
}
