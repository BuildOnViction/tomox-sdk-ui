import { connect } from 'react-redux'

import { logout } from '../../store/models/logoutPage'
import loginPageSelector, { loginWithWalletConnect } from '../../store/models/loginPage'

const mapStateToProps = (state) => {
    const selector = loginPageSelector(state)

    return {
        loading: selector.loading,
    }
}

const mapDispatchToProps = {
    loginWithWalletConnect,
    logout,
}

export default connect(mapStateToProps, mapDispatchToProps)