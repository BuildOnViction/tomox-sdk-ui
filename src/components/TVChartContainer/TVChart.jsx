import * as React from 'react'

import { Loading } from '../Common'
import TVChartRenderer from './TVChartRenderer'
import { timeSpans } from '../../store/models/ohlcv'

const modes = {
  dark: {
    "paneProperties.background": "#252C40",
    "paneProperties.vertGridProperties.color": "#252C40",
    "paneProperties.horzGridProperties.color": "#394362",
  },
  light: {
    "paneProperties.background": "#fff",
    "paneProperties.vertGridProperties.color": "#fff",
    "paneProperties.horzGridProperties.color": "#d7e1ea",
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
    const { currentPair: { pair, pricePrecision }} = this.props
    if (!pair || !pricePrecision) return <Loading />
    
    return (
      <React.Fragment>
        <TVChartRenderer {...this.props } modes={modes} changeTimeSpan={this.changeTimeSpan} />
      </React.Fragment>
    )
  }        
}
