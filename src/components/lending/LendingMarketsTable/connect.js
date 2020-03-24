import { connect } from 'react-redux'
import { updateFavorite } from '../../../store/actions/marketsTable'
import lendingMarketTableSelector, { redirectToLendingPage } from '../../../store/models/lending/lendingMarkets'

import type { State } from '../../../types'

export function mapStateToProps(state: State) {
  const marketTableSelector = lendingMarketTableSelector(state)

  return {
    ...marketTableSelector,
  }
}

export const mapDispatchToProps = {
  redirectToLendingPage,
  updateFavorite,
}

export default connect(mapStateToProps, mapDispatchToProps)
