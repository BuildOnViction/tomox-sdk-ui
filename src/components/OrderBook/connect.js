// @flow
import { connect } from 'react-redux'
import orderBookSelector from '../../store/models/orderBook'

import type { State } from '../../types'

export const mapStateToProps = (state: State) => {
  let { bids, asks, currentPair } = orderBookSelector(state)
  return { bids, asks, currentPair }
}

export const mapDispatchToProps = {}

export default connect(mapStateToProps)
