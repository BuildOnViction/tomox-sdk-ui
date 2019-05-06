// @flow
import { connect } from 'react-redux'
import orderBookSelector from '../../store/models/orderBook'
import { select } from '../../store/actions/orderBook'

import type { State } from '../../types'

export const mapStateToProps = (state: State) => {
  const { bids, asks, currentPair, currentPairData, referenceCurrency } = orderBookSelector(state)
  return { bids, asks, currentPair, currentPairData, referenceCurrency }
}

export const mapDispatchToProps = {
  select,
}

export default connect(mapStateToProps, mapDispatchToProps)
