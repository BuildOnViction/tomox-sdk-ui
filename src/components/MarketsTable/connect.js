import { connect } from 'react-redux'
import { updateFavorite } from '../../store/actions/marketsTable'
import getMarketTableSelector, { redirectToTradingPage, toggleAllowance } from '../../store/models/marketsTable'

import type { State } from '../../types'

export function mapStateToProps(state: State) {
  const marketTableSelector = getMarketTableSelector(state)

  return {
    ...marketTableSelector,
  }
}

export const mapDispatchToProps = {
  redirectToTradingPage,
  toggleAllowance,
  updateFavorite,
}

export default connect(mapStateToProps, mapDispatchToProps)
