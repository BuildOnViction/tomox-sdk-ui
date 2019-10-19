// @flow
import React from 'react'
import MarketsPageRenderer from './MarketsPageRenderer'
import type { TokenPair } from '../../types/tokens'

export type Props = {
  authenticated: boolean,
  connected: boolean,
  quoteTokens: Array<string>,
  loading: boolean,
  pairs: Array<TokenPair>,
  queryMarketData: void => void,
}

const MarketsPage = (props) => {
  const {
    loading,
    smallChartsData,
  } = props

  return (
    <MarketsPageRenderer
      loading={loading}
      smallChartsData={smallChartsData}
    />
  )
}

export default MarketsPage
