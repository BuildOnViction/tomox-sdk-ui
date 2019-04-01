import * as React from 'react'

// import { ToolbarChart } from './ToolbarChart'
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
  
  // const indicators: Array<Indicator> = [
  //   { name: 'Volume', active: false, height: 0 },
  //   { name: 'Trendline', active: true, height: 0 },
  //   { name: 'MACD', active: false, height: 160 },
  //   { name: 'RSI', active: false, height: 150 },
  //   { name: 'ATR', active: false, height: 150 },
  //   { name: 'ForceIndex', active: false, height: 150 },
  // ].map((p, index) => ({ ...p, rank: index }))
  
  // const chartTypes: Array<Object> = [
  //   { name: 'Candles', icon: 'timeline-bar-chart' },
  //   { name: 'Heikin Ashi', aicon: 'chart' },
  //   { name: 'Line', icon: 'timeline-line-chart' },
  //   { name: 'Area', icon: 'timeline-area-chart' },
  // ].map((p, index) => ({ ...p, rank: index }))
  
  // export const duration: Array<Object> = [
  //   { name: '1 Hour', label: '1h' },
  //   { name: '6 Hour', label: '6h' },
  //   { name: '12 Hour', label: '12h' },
  //   { name: '1 Day', label: '1d' },
  //   { name: '3 Days', label: '3d' },
  //   { name: '7 Days', label: '7d' },
  //   { name: '1 Month', label: '1M' },
  //   { name: '6 Month', label: '3M' },
  //   { name: '6 Month', label: '6M' },
  //   { name: '1 Year', label: '1Y' },
  //   { name: 'Full', label: 'Full' },
  // ].map((p, index) => ({ ...p, rank: index }))

  // type Props = {
  //   ohlcvData: Array<Object>,
  //   currentTimeSpan: Object,
  //   currentDuration: Object,
  //   noOfCandles: number,
  //   updateTimeLine: SendTimelineParams => void,
  //   updateDuration: (Object, Object) => void,
  //   updateTimeSpan: (Object, Object) => void,
  // }

export default class TVChart extends React.PureComponent {   
    // state = {
    //     chartHeight: 450,
    //     indicatorHeight: 0,
    //     currentChart: chartTypes[0],
    //     chartTypes,
    //     indicators,
    //     timeSpans,
    //     duration,
    //     expandedChard: true,
    //     isOpen: true,
    //   }   
      
      // changeDuration = (index: number) => {
      //   const { duration } = this.state
      //   const { currentTimeSpan } = this.props
      
      //   this.props.updateDuration(duration[index], {
      //     updateWRT: 'duration',
      //     time: this.props.ohlcv.currentTimeSpan.label,
      //     duration: duration[index].label,
      //   })
      //   this.setState({ isOpen: true })
      // }
      
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
            {/* <ToolbarChart 
                changeDuration={this.changeDuration}
                // onUpdateIndicators={onUpdateIndicators}
                changeTimeSpan={this.changeTimeSpan}
                changeChartType={this.changeChartType}
                currentDuration={ohlcv.currentDuration}
                currentTimeSpan={ohlcv.currentTimeSpan}
                state={this.state}
                // isOpen={isOpen}
                // toggleCollapse={this.toggleCollapse}
            /> */}
            <TVChartRenderer { ...this.props } changeTimeSpan={this.changeTimeSpan} />
          </React.Fragment>
        )
    }        
}
