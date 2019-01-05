// @flow
import React from 'react'
import MarketsPageRenderer from './MarketsPageRenderer'

import type { State } from '../../types'
import type { TokenPair } from '../../types/tokens'

export type Props = {
  authenticated: boolean,
  connected: boolean,
  toggleAllowance: (string, string) => void,
  redirectToTradingPage: (string, string) => void,
  quoteTokens: Array<string>,
  loading: boolean,
  pairs: Array<TokenPair>,
  queryMarketData: void => void,
}

class MarketsPage extends React.PureComponent<Props, State> {

  componentDidMount() {
    const { authenticated, queryMarketData } = this.props
    if (authenticated) queryMarketData()
  }

  render() {
    const {
      connected,
      pairs,
      toggleAllowance,
      redirectToTradingPage,
      quoteTokens,
      loading,
    } = this.props

    return (
      <MarketsPageRenderer
        pairs={pairs}
        quoteTokens={quoteTokens}
        connected={connected}
        toggleAllowance={toggleAllowance}
        loading={loading}
        redirectToTradingPage={redirectToTradingPage}
      />
    )
  }
}

export default MarketsPage
