// @flow
import { connect } from 'react-redux'
import tradingPageSelector, { queryDappTradePageData, releaseResources } from '../../../store/models/lending/lendingTradingPage'

import type { State } from '../../../types'

export function mapStateToProps(state: State) {
  const tradingPageProps = tradingPageSelector(state)

  return {
    ...tradingPageProps,
  }
}

export const mapDispatchToProps = {
  queryDappTradePageData,
  releaseResources,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
