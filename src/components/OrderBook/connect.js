// @flow
import { connect } from 'react-redux'
import orderBookSelector from '../../store/models/orderBook'
import tradesTableSelector from '../../store/models/tradesTable';

import type { State } from '../../types'

export const mapStateToProps = (state: State) => {
  const latestTrade = tradesTableSelector(state).trades(1)[0]
  const { bids, asks, currentPair } = orderBookSelector(state)
  return { bids, asks, currentPair, latestTrade }
}

export const mapDispatchToProps = {}

export default connect(mapStateToProps)
