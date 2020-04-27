// @flow
import { connect } from 'react-redux'
import getWalletPageSelector from '../../store/models/walletPage'

import type { State } from '../../types'

export function mapStateToProps(state: State) {
  const walletPageSelector = getWalletPageSelector(state)

  return {
    ...walletPageSelector,
  }
}

export default connect(
  mapStateToProps,
  null,
)
