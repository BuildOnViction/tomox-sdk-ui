import { connect } from 'react-redux'

import { logout } from '../../store/models/logoutPage'
import { loginWithWalletConnect } from '../../store/models/loginPage'

const mapDispatchToProps = {
    loginWithWalletConnect,
    logout,
}

export default connect(null, mapDispatchToProps)