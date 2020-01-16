// @flow
import { connect } from 'react-redux'
import orderBookSelector from '../../store/models/orderBook'

import type { State } from '../../types'

export const mapStateToProps = (state: State) => {
  const { bids, asks, currentPairData } = orderBookSelector(state)
  return { bids, asks, currentPairData }
}

export const mapDispatchToProps = {}

export default connect(mapStateToProps)
