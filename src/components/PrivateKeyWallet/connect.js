import { connect } from 'react-redux'
import loginPageSelector, { loginWithWallet } from '../../store/models/loginPage'

const mapStateToProps = (state) => {
    const selector = loginPageSelector(state)

    return {
        loading: selector.loading,
    }
}

const mapDispatchToProps = {
    loginWithWallet,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)
