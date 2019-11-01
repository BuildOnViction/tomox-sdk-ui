// @flow
import React from 'react'
import MarketsPageRenderer from './MarketsPageRenderer'

export type Props = {
  smallChartsData: Array,
}

const MarketsPage = (props) => {
  const {
    smallChartsData,
  } = props

  return (
    <MarketsPageRenderer
      smallChartsData={smallChartsData}
    />
  )
}

export default MarketsPage
