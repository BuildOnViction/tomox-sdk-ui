// @flow
import { connect } from 'react-redux'
import lendinOrderBookSelector from '../../../store/models/lending/lendingOrderBook'
import { selectOrder } from '../../../store/actions/lending/lendingOrderBook'

import type { State } from '../../../types'

export const mapStateToProps = (state: State) => {
  const selector = lendinOrderBookSelector(state)
  return { ...selector }
}

export const mapDispatchToProps = {
  selectOrder,
}

export default connect(mapStateToProps, mapDispatchToProps)
