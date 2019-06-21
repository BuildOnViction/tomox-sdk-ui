// @flow
import React from 'react'
import MarketsPageRenderer from './MarketsPageRenderer'

import type { State } from '../../types'
import type { TokenPair } from '../../types/tokens'

export type Props = {
  authenticated: boolean,
  connected: boolean,
  quoteTokens: Array<string>,
  loading: boolean,
  pairs: Array<TokenPair>,
  queryMarketData: void => void,
}

class MarketsPage extends React.PureComponent<Props, State> {

  componentDidMount() {
    const { queryMarketData, webSocketIsOpened } = this.props
    if (webSocketIsOpened) { queryMarketData() }
  }

  componentDidUpdate(prevProps) {
    const prevWebSocketStatus = prevProps.webSocketIsOpened
    const { queryMarketData, webSocketIsOpened } = this.props
    
    if(webSocketIsOpened && !prevWebSocketStatus) {
      queryMarketData()
    }
  }

  componentWillUnmount() {
    this.props.releaseResources()
  }

  render() {
    const {
      loading,
      smallChartsData,
    } = this.props

    return (
      <MarketsPageRenderer
        loading={loading}
        smallChartsData={smallChartsData}
      />
    )
  }
}

export default MarketsPage
