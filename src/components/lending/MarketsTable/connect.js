import { connect } from 'react-redux'
import { updateFavorite } from '../../../store/actions/marketsTable'
import getMarketTableSelector, { redirectToLendingPage } from '../../../store/models/lending/marketsTable'

import type { State } from '../../../types'

export function mapStateToProps(state: State) {
  const marketTableSelector = getMarketTableSelector(state)

  return {
    ...marketTableSelector,
  }
}

export const mapDispatchToProps = {
  redirectToLendingPage,
  updateFavorite,
}

export default connect(mapStateToProps, mapDispatchToProps)
