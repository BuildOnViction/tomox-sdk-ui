// @flow
import { getTokenPairsDomain } from '../domains'
import OHLCVModel from '../domains/ohlcv'
import * as actionCreators from '../actions/ohlcv'
import { timeSpans } from '../../components/OHLCV/OHLCV'
import type { SendTimelineParams } from '../../types/ohlcv'
import type { State, ThunkAction } from '../../types'

export default function getOHLCVModel(state: State) {
  return OHLCVModel(state.ohlcv)
}

export const resetOHLCVData = (): ThunkAction => {
  return (dispatch) => {
    dispatch(actionCreators.resetOHLCVData())
  }
}

export const updateTimeLine = ({
  updateWRT,
}: SendTimelineParams): ThunkAction => {
  return async (dispatch, getState) => {
    const currentDuration = getState().ohlcv.currentDuration.label
    const currentTimeSpan = getState().ohlcv.currentTimeSpan.label

    if (updateWRT === 'timespan') {
      const candles = byTimeSpan(currentDuration, currentTimeSpan)
      if (candles > 40)
        return dispatch(actionCreators.saveNoOfCandles(parseInt(candles, 10)))
    } else {
      const { candles, time } = byDuration(currentDuration)
      if (time) dispatch(actionCreators.saveTimeSpan(timeSpans[time]))
      return dispatch(actionCreators.saveNoOfCandles(parseInt(candles, 10)))
    }
  }
}

export const updateTimeSpan = (
  currentTimeSpan: Object,
  config: Object
): ThunkAction => {
  return (dispatch, getState, { socket }) => {
    socket.unsubscribeChart()
    const durationByTimeSpan = getDurationByTimeSpan(currentTimeSpan)
    dispatch(actionCreators.saveDuration(durationByTimeSpan))
    dispatch(actionCreators.saveTimeSpan(currentTimeSpan))
    dispatch(updateTimeLine(config))

    const state = getState()
    const pairDomain = getTokenPairsDomain(state)
    const currentPair = pairDomain.getCurrentPair()

    socket.subscribeChart(
      currentPair,
      state.ohlcv.currentTimeSpan.label,
      state.ohlcv.currentDuration.label
    )
  }
}

export const updateDuration = (
  currentDuration: Object,
  config: Object
): ThunkAction => {
  return (dispatch, getState, { socket }) => {
    dispatch(actionCreators.saveDuration(currentDuration))
    dispatch(updateTimeLine(config))

    const state = getState()
    const pairDomain = getTokenPairsDomain(state)
    const currentPair = pairDomain.getCurrentPair()

    socket.subscribeChart(
      currentPair,
      state.ohlcv.currentTimeSpan.label,
      state.ohlcv.currentDuration.label
    )
  }
}

function byDuration(duration) {
  switch (duration) {
    case '1h':
      return { time: 0, candles: 60 }

    case '6h':
      return { time: 1, candles: 72 }

    case '12h':
      return { time: 1, candles: 144 }

    case '1d':
      return { time: 2, candles: 96 }

    case '3d':
      return { time: 3, candles: 144 }

    case '7d':
      return { time: 4, candles: 168 }

    case '1M':
      return { time: 5, candles: 180 }

    case '3M':
      return { time: 6, candles: 180 }

    case '6M':
      return { time: 7, candles: 180 }

    case '1Y':
      return { time: 8, candles: 104 }

    default:
      return { candles: 150, time: '' }
  }
}

function getDurationByTimeSpan(timeSpan) {
  switch (timeSpan.label) {
    case '1m':
    case '5m':
      return { name: '1 Day', label: '1d' }
    case '15m':
      return { name: '2 Day', label: '2d' }
    case '30m':
      return { name: '3 Day', label: '3d' }
    case '1h': 
      return { name: '2 Month', label: '2M' }
    case '2h':
      return { name: '4 Month', label: '4M' }
    case '4h':
      return { name: '9 Month', label: '9M' }
    case '1D':
      return { name: '1 Year', label: '1Y' }
    case '1W': 
      return { name: '7 Year', label: '7Y' }
    default:
      return { name: 'Full', label: 'Full' }
  }
}

function byTimeSpan(duration, time) {
  return getCandles(duration) / timeToMinutes(time)
}

function getCandles(duration) {
  switch (duration) {
    case '1h':
      return 60

    case '4h':
      return 240

    case '12h':
      return 720

    case '1d':
      return 1440

    case '3d':
      return 4320

    case '7d':
      return 10080

    case '1M':
      return 44640

    case '3M':
      return 133920

    case '6M':
      return 267840

    case '1Y':
      return 535680

    default:
      return 0
  }
}

function timeToMinutes(time) {
  switch (time) {
    case '1m':
      return 1

    case '5m':
      return 5

    case '15m':
      return 15

    case '30m':
      return 20

    case '1h':
      return 60

    case '4h':
      return 240

    case '12h':
      return 720

    case '1d':
      return 1440

    case '7d':
      return 10080

    case '1M':
      return 44640

    default:
      return 0
  }
}
