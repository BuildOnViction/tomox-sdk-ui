/* eslint-disable */
import configureStore from '../../../store/configureStore'

const { store } = configureStore

export default {
  subscribeBars: (symbolInfo, resolution, updateCb, uid, resetCache) => { 

    window.unsubscribe = store.subscribe(() => {
      const { ohlcv: { ohlcvData } } = store.getState()

      if (ohlcvData && ohlcvData.length > 0 && window.tvWidget.latestBar) {
        const currLatestBar = ohlcvData.slice(-1)[0]

        if (currLatestBar.time !== window.tvWidget.latestBar.time) {
          window.tvWidget.latestBar = JSON.parse(JSON.stringify(currLatestBar))
          updateCb(currLatestBar)
        }
      }      
    }) 
  },
  unsubscribeBars: function(uid) {
    window.unsubscribe()
    window.tvWidget.latestBar = null
  }
}

