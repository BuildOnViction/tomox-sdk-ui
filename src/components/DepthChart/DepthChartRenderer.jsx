import React from 'react'
import 'amcharts3/amcharts/amcharts'
import 'amcharts3/amcharts/serial'
import 'amcharts3/amcharts/themes/light'

const AmCharts = require('@amcharts/amcharts3-react')

type BidOrAsk = {
  price: number,
  amount: number,
  total: number
}

type ChartProps = {
  title: string,
  bids: Array<BidOrAsk>,
  asks: Array<BidOrAsk>,
  toolTip: (Object, Object) => string
}

const DepthChartRenderer = (props: ChartProps) => {
  const { asks, bids, toolTip, title } = props

  return (
      <AmCharts.React
        className="depth-chart"
        style={{
          width: '100%',
          height: '100%',
        }}
        options={{
          type: 'serial',
          fontFamily: 'SFProText, -apple-system, "BlinkMacSystemFont", "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Open Sans", "Helvetica Neue", "Icons16", sans-serif;',
          dataProvider: [...bids.reverse(), ...asks],
          graphs: [
            {
              id: 'bids',
              fillAlphas: 0.1,
              lineAlpha: 1,
              lineThickness: 2,
              lineColor: '#00c38c',
              type: 'step',
              valueField: 'bidstotal',
              balloonFunction: toolTip,
            },
            {
              id: 'asks',
              fillAlphas: 0.1,
              lineAlpha: 1,
              lineThickness: 2,
              lineColor: '#f94d5c',
              type: 'step',
              valueField: 'askstotal',
              balloonFunction: toolTip,
            },
            {
              lineAlpha: 0,
              fillAlphas: 0.2,
              lineColor: '#00c38c',
              type: 'column',
              clustered: false,
              valueField: 'bidsamount',
              showBalloon: false,
            },
            {
              lineAlpha: 0,
              fillAlphas: 0.2,
              lineColor: '#f94d5c',
              type: 'column',
              clustered: false,
              valueField: 'asksamount',
              showBalloon: false,
            },
          ],
          categoryField: 'price',
          chartCursor: {},
          balloon: {
            textAlign: 'left',
          },
          categoryAxis: {
            title,
            minHorizontalGap: 100,
            startOnAxis: true,
            showFirstLabel: false,
            showLastLabel: false,
            color: '#6e7793',
            gridThickness: 0,
            axisColor: '#394362',
          },
          valueAxes: [{
            axisColor: '#394362',
            gridColor: '#394362',
            gridThickness: 1,
            gridAlpha: 0.4,
            color: '#6e7793',
          }],
        }}
      />
  )
}
export default DepthChartRenderer
