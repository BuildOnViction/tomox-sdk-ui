// @flow
import { connect } from 'react-redux'
import getMarketsPageSelector, {
  queryMarketData,
  releaseResources,
} from '../../store/models/marketsPage'

import type { State } from '../../types'


export function mapStateToProps(state: State) {
  const marketsPageSelector = getMarketsPageSelector(state)

  return {
    ...marketsPageSelector,
  }
}

export const mapDispatchToProps = {
  queryMarketData,
  releaseResources,
}

export default connect(mapStateToProps, mapDispatchToProps)
