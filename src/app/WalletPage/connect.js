// @flow
import { connect } from 'react-redux'
import getWalletPageSelector, {
  queryAccountData,
  toggleAllowance,
  redirectToTradingPage,
} from '../../store/models/walletPage'
import { copyDataSuccess } from '../../store/models/app'
import { removeNotification } from '../../store/actions/app'
import { closeHelpModal } from '../../store/actions/walletPage'

import type { State } from '../../types'

export function mapStateToProps(state: State) {
  const walletPageSelector = getWalletPageSelector(state)

  return {
    ...walletPageSelector,
  }
}

export const mapDispatchToProps = {
  queryAccountData,
  removeNotification,
  toggleAllowance,
  redirectToTradingPage,
  closeHelpModal,
  copyDataSuccess,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
