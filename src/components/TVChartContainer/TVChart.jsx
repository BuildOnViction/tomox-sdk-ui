import * as React from 'react'
import TVChartRenderer from './TVChartRenderer'
import { Loading } from '../Common'

export default class TVChart extends React.PureComponent {

    render() {
        const { currentPair: { pair }, ohlcv } = this.props

        if (!pair || !ohlcv || ohlcv.ohlcvData.length === 0) { return <Loading /> }
        
        return <TVChartRenderer { ...this.props } />
    }        
}