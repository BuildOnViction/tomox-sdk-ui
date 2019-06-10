import { connect } from 'react-redux'
import loginPageSelector, {
    loginWithMetamask,
    loginWithWallet,
    loginWithTrezorWallet,
    loginWithLedgerWallet,
    getTrezorPublicKey,
    closeSelectAddressModal,
} from '../../store/models/loginPage'
import { removeNotification } from '../../store/actions/app'

export function mapStateToProps(state, props) {
    const selector = loginPageSelector(state)

    return {
        authenticated: selector.authenticated,
        loading: selector.loading,
        isSelectAddressModalOpen: selector.isSelectAddressModalOpen,
    }
}

const mapDispatchToProps = {
    loginWithWallet,
    loginWithMetamask,
    loginWithTrezorWallet,
    loginWithLedgerWallet,
    removeNotification,
    getTrezorPublicKey,
    closeSelectAddressModal,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)
