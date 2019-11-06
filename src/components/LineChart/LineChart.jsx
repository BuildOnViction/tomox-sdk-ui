// @flow

import React from 'react'
import LineChartRenderer from './LineChartRenderer'

const colorsCollection = {  
  'BTC': ['#cddc39', '#4caf50', '#8bc34a'],
  'ETH': ['#3f51b5', '#3f8db5', '#3fb57b'],
  'XRP': ['#2196f3', '#00bcd4', '#009688'],
  'TOMO': ['#9c27b0', '#673ab7', '#2196f3'],
}

const LineChart = (props) => {
  const { code, data } = props
  const randomCode = Object.keys(colorsCollection)[Math.floor((Math.random()*4))]
  const colors = colorsCollection[code] ? colorsCollection[code] : colorsCollection[randomCode]

  return (
    <LineChartRenderer data={data} colors={colors} />
  )
}

export default LineChart
