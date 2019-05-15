// @flow
import { connect } from 'react-redux'
import { copyDataSuccess } from '../../store/models/createWalletPage'
import loginPageSelector, { loginWithWallet } from '../../store/models/loginPage'

export function mapStateToProps(state, props) {
  const selector = loginPageSelector(state)

  return {
      authenticated: selector.authenticated,
  }
}

export const mapDispatchToProps = { loginWithWallet, copyDataSuccess }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
