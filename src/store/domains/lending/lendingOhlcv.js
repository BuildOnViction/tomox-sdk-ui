// @flow
import type { OHLCVState } from '../../../types/ohlcv'

const initialState: OHLCVState = {
  ohlcvData: [],
  noOfCandles: 150,
  currentTimeSpan: { name: '1 min', label: '1m', value: '1' },
  currentDuration: { name: '1 Day', label: '1d' },
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

export const loading = (status: boolean) => {
  const event = (state: OHLCVState): OHLCVState => ({
    ...state,
    loading: status,
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
