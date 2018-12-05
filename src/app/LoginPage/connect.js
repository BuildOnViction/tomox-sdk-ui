import { connect } from 'react-redux';
import loginPageSelector, {
    loginWithMetamask,
    loginWithWallet,
    loginWithTrezorWallet,
    loginWithLedgerWallet,
    getTrezorPublicKey
} from '../../store/models/loginPage';
import { removeNotification } from '../../store/actions/app';

export function mapStateToProps(state, props) {
    const selector = loginPageSelector(state);

    return {
        authenticated: selector.authenticated,
        loading: selector.loading
    };
}

const mapDispatchToProps = {
    loginWithWallet,
    loginWithMetamask,
    loginWithTrezorWallet,
    loginWithLedgerWallet,
    removeNotification,
    getTrezorPublicKey
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
);
