// @flow
import { connect } from 'react-redux'
import getMarketsPageSelector from '../../../store/models/marketsPage'

import type { State } from '../../../types'


export function mapStateToProps(state: State) {
  const marketsPageSelector = getMarketsPageSelector(state)

  return {
    ...marketsPageSelector,
  }
}

export default connect(mapStateToProps)
