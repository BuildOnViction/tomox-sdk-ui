import { connect } from 'react-redux'
import loginPageSelector, {
    loginWithLedgerWallet,
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
    loginWithLedgerWallet,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)
