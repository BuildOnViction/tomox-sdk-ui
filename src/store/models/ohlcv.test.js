import createStore from '../../store/configureStore'

import getOHLCVModel, { updateTimeLine } from './ohlcv'
import { getOhlcvDomain } from '../domains'

it('checks Initial Model return', async () => {
  /*
  const initialState = {
    ohlcvData: [],
    noOfCandles: 150,
    currentTimeSpan: { name: '1 min', label: '1m', value: '1' },
    currentDuration: { name: '1 Day', label: '1d' },
    loading: false,
  }
  */
  const expected = {
    "_persist": {
      "rehydrated": false,
      "version": -1,
    },
    "currentDuration": {
      "label": "1d",
      "name": "1 Day",
    },
    "currentTimeSpan": {
      "label": "1m",
      "name": "1 min",
      "value": "1",
    },
    "loading": false,
    "noOfCandles": 150,
    "ohlcvData": [],
  }
  const { store } = createStore()
  const defaultOHLCVDomain = getOHLCVModel(store.getState()).getState()
  expect(defaultOHLCVDomain).toEqual(expected)
})

it('check updateTimeLine on Duration/Time change', async () => {
  const { store } = createStore()
  store.dispatch(updateTimeLine({ updateWRT: 'duration' }))
  const ohlcvDomain = getOhlcvDomain(store.getState()).getState()

  expect(ohlcvDomain.noOfCandles).toEqual(96)
})
