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

export default class TVChart extends React.PureComponent {    
    
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
            <TVChartRenderer { ...this.props } changeTimeSpan={this.changeTimeSpan} />
          </React.Fragment>
        )
    }        
}
