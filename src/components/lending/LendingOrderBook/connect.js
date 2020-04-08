// @flow
import { connect } from 'react-redux'
import lendinOrderBookSelector from '../../../store/models/lending/lendingOrderBook'
import { selectOrder } from '../../../store/actions/lending/lendingOrderBook'

import type { State } from '../../../types'

export const mapStateToProps = (state: State) => {
  const { bids, asks, currentPair, currentPairData, referenceCurrency } = lendinOrderBookSelector(state)
  return { bids, asks, currentPair, currentPairData, referenceCurrency }
}

export const mapDispatchToProps = {
  selectOrder,
}

export default connect(mapStateToProps, mapDispatchToProps)
