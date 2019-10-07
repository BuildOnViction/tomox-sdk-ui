import * as React from 'react'

import TVChartRenderer from './TVChartRenderer'
import { Loading } from '../Common'

export const timeSpans: Array<Object> = [
  { name: '1 min', label: '1m', value: '1' },
  { name: '5 min', label: '5m', value: '5' },
  { name: '15 min', label: '15m', value: '15' },
  { name: '30 min', label: '30m', value: '30' },
  { name: '1 hr', label: '1h', value: '60' },
  { name: '2 hr', label: '2h', value: '120' },
  { name: '4 hr', label: '4h', value: '240' },
  { name: '12 hr', label: '12h', value: '720' },
  { name: '1 day', label: '1d', value: '1D' },
  { name: '7 days', label: '7d', value: '1W' },
  { name: '1 month', label: '1M', value: '1M' },
].map((p, index) => ({ ...p, rank: index }))

const modes = {
  dark: {
    "volumePaneSize": "medium",
    "paneProperties.background": "#252C40",
    "paneProperties.vertGridProperties.color": "#252C40",
    "paneProperties.horzGridProperties.color": "#394362",
    "paneProperties.legendProperties.showSeriesTitle": false,
    "scalesProperties.textColor" : "#6e7793",
    "scalesProperties.fontSize": 12,
    "scalesProperties.lineColor": "#394362",
    // "mainSeriesProperties.candleStyle.wickUpColor": '#336854',
    // "mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
    "timeScale.rightOffset": 5,
  },
  light: {
    "volumePaneSize": "medium",
    "paneProperties.background": "#fff",
    "paneProperties.vertGridProperties.color": "#fff",
    "paneProperties.horzGridProperties.color": "#d7e1ea",
    "paneProperties.legendProperties.showSeriesTitle": false,
    "scalesProperties.textColor" : "#6e7793",
    "scalesProperties.fontSize": 12,
    "scalesProperties.lineColor": "#394362",
    // "mainSeriesProperties.candleStyle.wickUpColor": '#336854',
    // "mainSeriesProperties.candleStyle.wickDownColor": '#7f323f',
    "timeScale.rightOffset": 5,
  },
}

export default class TVChart extends React.PureComponent {    

    componentDidUpdate(prevProps) {
      if (prevProps.mode !== this.props.mode 
        && window.tvWidget) {
        window.tvWidget.changeTheme(this.props.mode)
        window.tvWidget.applyOverrides({
          ...modes[this.props.mode],
        })
      }
    }
    
    changeTimeSpan = (value: string) => {
      this.props.resetOHLCVData()

      const { ohlcv: { currentDuration }} = this.props
      const interval = timeSpans.find(item => {
        return item.value === value
      })
    
      this.props.updateTimeSpan(interval, {
        updateWRT: 'timespan',
        time: interval.label,
        duration: currentDuration.label,
      })
    }

    render() {
        const { currentPair: { pair }, ohlcv } = this.props

        if (!pair || !ohlcv || ohlcv.ohlcvData.length === 0) { return <Loading /> }
        
        return (
          <React.Fragment>
            <TVChartRenderer {...this.props } modes={modes} changeTimeSpan={this.changeTimeSpan} />
          </React.Fragment>
        )
    }        
}
