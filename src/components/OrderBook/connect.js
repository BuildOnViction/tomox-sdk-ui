// @flow
import { connect } from 'react-redux'
import orderBookSelector from '../../store/models/orderBook'
import { select, updateDecimals } from '../../store/actions/orderBook'

import type { State } from '../../types'

export const mapStateToProps = (state: State) => {
  const selector = orderBookSelector(state)
  return { ...selector }
}

export const mapDispatchToProps = {
  select,
  updateDecimals,
}

export default connect(mapStateToProps, mapDispatchToProps)
