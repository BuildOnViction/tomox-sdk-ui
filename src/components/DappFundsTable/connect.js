// @flow
import { connect } from 'react-redux'
import getWalletPageSelector, { updateShowHideBalance } from '../../store/models/walletPage'

import type { State } from '../../types'

export function mapStateToProps(state: State) {
  const walletPageSelector = getWalletPageSelector(state)

  return {
    ...walletPageSelector,
  }
}

export const mapDispatchToProps = {
  updateShowHideBalance,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
