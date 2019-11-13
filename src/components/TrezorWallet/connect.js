import { connect } from 'react-redux'
import loginPageSelector, {
    loginWithTrezorWallet,
} from '../../store/models/loginPage'

export function mapStateToProps(state, props) {
    const selector = loginPageSelector(state)

    return {
        authenticated: selector.authenticated,
        loading: selector.loading,
        isSelectAddressModalOpen: selector.isSelectAddressModalOpen,
    }
}

const mapDispatchToProps = {
    loginWithTrezorWallet,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)
