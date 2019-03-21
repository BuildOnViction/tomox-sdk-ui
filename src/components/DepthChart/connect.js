// @flow
import { connect } from 'react-redux'
import orderBookSelector from '../../store/models/orderBook'

import type { State } from '../../types'

export const mapStateToProps = (state: State) => {
  const { bids, asks } = orderBookSelector(state)
  return { bids, asks }
}

export const mapDispatchToProps = {}

export default connect(mapStateToProps)
