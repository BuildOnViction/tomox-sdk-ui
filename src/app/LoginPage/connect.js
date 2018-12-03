import { connect } from 'react-redux'
import loginPageSelector, { loginWithMetamask, loginWithWallet, loginWithTrezorWallet, loginWithLedgerWallet } from '../../store/models/loginPage'
import { removeNotification } from '../../store/actions/app'

export function mapStateToProps(state, props) {
  const selector = loginPageSelector(state)

  return {
    authenticated: selector.authenticated
  }
}

const mapDispatchToProps = {
  loginWithWallet,
  loginWithMetamask,
  loginWithTrezorWallet,
  loginWithLedgerWallet,
  removeNotification
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
