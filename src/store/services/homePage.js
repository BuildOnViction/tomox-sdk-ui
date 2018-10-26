import * as ohlcv from './api/ohlcv'
export const getData = async () => {
  return ohlcv.getData().then(data => data.slice(0, 100))
}
