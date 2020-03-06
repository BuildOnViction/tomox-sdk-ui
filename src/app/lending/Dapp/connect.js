// @flow
import { connect } from 'react-redux'
import tradingPageSelector, { queryTradingPageData, releaseResources } from '../../../store/models/tradingPage'

import type { State } from '../../../types'

export function mapStateToProps(state: State) {
  const tradingPageProps = tradingPageSelector(state)

  return {
    ...tradingPageProps,
  }
}

export const mapDispatchToProps = {
  queryTradingPageData,
  releaseResources,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
