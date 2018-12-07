// @flow
import React from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import LoginPageRenderer from './LoginPageRenderer';
import SelectAddressModal from '../../components/SelectAddressModal';
import { createWalletFromJSON } from '../../store/services/wallet';
import type { LoginWithWallet } from '../../types/loginPage';
import { TrezorSigner } from '../../store/services/signer/trezor';

type Props = {
    authenticated: boolean,
    loading: boolean,
    loginWithMetamask: () => void,
    loginWithWallet: LoginWithWallet => void,
    loginWithTrezorWallet: () => void,
    loginWithLedgerWallet: () => void,
    removeNotification: any => void,
    getTrezorPublicKey: (Object, ?string) => void,
};

//TODO: Remove Notification handling

type State = {
    view: string,
    metamaskStatus: 'unlocked' | 'locked' | 'undefined',
    isSelectAddressModalOpen: boolean
};

class LoginPage extends React.PureComponent<Props, State> {
    deviceService: ?Object = null;

    state = {
        view: 'loginMethods',
        metamaskStatus: 'undefined',
        isSelectAddressModalOpen: false
    };

    openSelectAddressModal = async () => {
        this.deviceService = new TrezorSigner();
        await this.props.getTrezorPublicKey(this.deviceService);

        this.setState({
            isSelectAddressModalOpen: true
        });
    };

    closeSelectAddressModal = () => {
        this.setState({ isSelectAddressModalOpen: false });
    };

    componentDidMount = () => {
        typeof window.web3 === 'undefined'
            ? this.setState({ metamaskStatus: 'undefined' })
            : typeof window.web3.eth.defaultAccount === 'undefined'
            ? this.setState({ metamaskStatus: 'locked' })
            : this.setState({ metamaskStatus: 'unlocked' });
    };

    showWalletLoginForm = () => {
        this.setState({ view: 'wallet' });
    };

    showLoginMethods = () => {
        this.setState({ view: 'loginMethods' });
    };

    showCreateWallet = () => {
        this.setState({ view: 'createWallet' });
    };

    loginWithMetamask = () => {
        this.props.loginWithMetamask();
    };

    hideModal = () => {
        this.setState({ view: 'loginMethods' });
    };

    componentWillMount = () => {
        // this.props.removeNotification({ id: 1 });
    };

    walletCreated = async (props: Object) => {
        const {
            password,
            encryptedWallet,
            storeWallet,
            storePrivateKey
        } = props;
        var { wallet } = await createWalletFromJSON(encryptedWallet, password);
        if (wallet) {
            this.props.loginWithWallet({
                wallet,
                encryptedWallet,
                storeWallet,
                storePrivateKey
            });
        }
    };

    render() {
        const {
            props: {
                loginWithMetamask,
                loginWithWallet,
                loginWithTrezorWallet,
                loginWithLedgerWallet,
                authenticated,
                loading
            },
            state: { view, metamaskStatus, isSelectAddressModalOpen },
            showWalletLoginForm,
            showLoginMethods,
            showCreateWallet,
            hideModal,
            walletCreated,
            openSelectAddressModal
        } = this;

        // go to wallet by default to update balances
        if (authenticated) {
            // check if there is no account balances then go to /wallet page
            return <Redirect to="/wallet" />;
        }
        return (
            <Wrapper>
                <LoginPageRenderer
                    view={view}
                    metamaskStatus={metamaskStatus}
                    loginWithWallet={loginWithWallet}
                    showCreateWallet={showCreateWallet}
                    hideModal={hideModal}
                    walletCreated={walletCreated}
                    loginWithMetamask={loginWithMetamask}
                    openSelectAddressModal={openSelectAddressModal}
                    loginWithTrezorWallet={loginWithTrezorWallet}
                    loginWithLedgerWallet={loginWithLedgerWallet}
                    showWalletLoginForm={showWalletLoginForm}
                    showLoginMethods={showLoginMethods}
                    loading={loading}
                />
                <SelectAddressModal
                    title="Select Trezor Address"
                    isOpen={isSelectAddressModalOpen}
                    handleClose={this.closeSelectAddressModal}
                    deviceService={this.deviceService}
                />
            </Wrapper>
        );
    }
}

const Wrapper = styled.div`
    height: 100%;
`;

export default LoginPage;
