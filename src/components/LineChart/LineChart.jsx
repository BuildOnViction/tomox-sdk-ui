// @flow

import React from 'react'
import LineChartRenderer from './LineChartRenderer'

const generateData = (n) => {
  const data = []

  while (data.length <= n) {
    const price = Math.random() * 300
    data.push({ price })
  }

  return data
}

const colorsCollection = [
  ['#9c27b0', '#673ab7', '#2196f3'],
  ['#4caf50', '#8bc34a', '#cddc39'],
  ['#673ab7', '#3f51b5', '#2196f3'],
  ['#2196f3', '#00bcd4', '#009688'],
  ['#3f51b5', '#3f8db5', '#3fb57b'],
  ['#4caf50', '#2196f3', '#3f51b5'],
  ['#cddc39', '#4caf50', '#8bc34a'],
]

class LineChart extends React.PureComponent<Props, State> {

  render() {
    return (
      <LineChartRenderer data={generateData(24)} colors={colorsCollection[Math.floor(Math.random() * colorsCollection.length)]} />
    )
  }
}

export default LineChart
