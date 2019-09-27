//@flow
import { connect } from 'react-redux'
import { loginWithMetamask } from '../../store/models/loginPage'
import layoutSelector, {
  createProvider,
  changeLocale,
  changeMode,
  queryAppData,
  queryAccountData,
  releaseResource,
  closeSessionPasswordModal,
  unlockWalletWithSessionPassword,
} from '../../store/models/layout'
import type { State } from '../../types'
import type { Props as LayoutProps } from './Layout'
import { copyDataSuccess } from '../../store/models/app'
import { markNotificationRead } from '../../store/actions/notifications'
import { logout } from '../../store/models/logoutPage'

export function mapStateToProps(state: State, props: Object): LayoutProps {
  const selector = layoutSelector(state)

  return {
    ...selector,
  }
}

const mapDispatchToProps = {
  createProvider,
  changeLocale,
  changeMode,
  queryAppData,
  queryAccountData,
  copyDataSuccess,
  releaseResource,
  markNotificationRead,
  logout,
  closeSessionPasswordModal,
  unlockWalletWithSessionPassword,
  loginWithMetamask,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
