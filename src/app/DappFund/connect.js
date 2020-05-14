// @flow
import { connect } from 'react-redux'
import loginPageSelector from '../../store/models/loginPage'

export function mapStateToProps(state, props) {
  const selector = loginPageSelector(state)

  return {
    authenticated: selector.authenticated,
  }
}

export default connect(
  mapStateToProps,
)
