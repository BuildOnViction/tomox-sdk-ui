/* eslint-disable */
import configureStore from '../../../store/configureStore'
import * as socket from '../../../store/services/socket'
import { getTokenPairsDomain } from '../../../store/domains'

var unsubscribe = null
const { store } = configureStore

export default {
  subscribeBars: (symbolInfo, resolution, updateCb, uid, resetCache) => {   
    // let prevOhlcvData = []
    // unsubscribe = store.subscribe(() => {
    //   const { ohlcv: { ohlcvData } } = store.getState()
    //   if ((ohlcvData.length - prevOhlcvData.length) === 1) {
    //     console.log('update chart')
    //     const latestBar = ohlcvData[ohlcvData.length - 1]
    //     updateCb(latestBar)
    //   }

    //   prevOhlcvData = JSON.parse(JSON.stringify(ohlcvData))
    // })    
  },
  unsubscribeBars: function(uid) {
    // unsubscribe()
  }
}

