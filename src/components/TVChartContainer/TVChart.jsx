import * as React from 'react'
import { FormattedMessage } from 'react-intl'

import { TmColors, Centered, Text, UtilityIcon, Loading } from '../Common'
import TVChartRenderer from './TVChartRenderer'
import { timeSpans } from '../../store/models/ohlcv'

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

const NoData = () => {
  return (
    <Centered my={4}>
      <UtilityIcon name="not-found" width={32} height={32} />
      <Text sm={true} color={TmColors.GRAY}><FormattedMessage id="exchangePage.noData" />.</Text>
    </Centered>
  )
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
      // this.props.resetOHLCVData()

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
      if (!pair || ohlcv.loading) return <Loading />
      if (ohlcv.ohlcvData.length === 0 && !ohlcv.loading) return <NoData />
      
      return (
        <React.Fragment>
          <TVChartRenderer {...this.props } modes={modes} changeTimeSpan={this.changeTimeSpan} />
        </React.Fragment>
      )
    }        
}
