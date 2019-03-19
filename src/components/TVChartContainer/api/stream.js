/* eslint-disable */
import configureStore from '../../../store/configureStore'

const { store } = configureStore

export default {
  subscribeBars: (symbolInfo, resolution, updateCb, uid, resetCache) => {   
    window.unsubscribe = store.subscribe(() => {
      const { ohlcv: { ohlcvData } } = store.getState()
      if (ohlcvData && ohlcvData.length > 0) {
        const bar = ohlcvData.slice(-1)[0]
        updateCb(bar)
      }      
    }) 
  },
  unsubscribeBars: function(uid) {
    window.unsubscribe()
  }
}

