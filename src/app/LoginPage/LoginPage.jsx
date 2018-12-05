// @flow
import React from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import LoginPageRenderer from './LoginPageRenderer';
import SelectAddressModal from '../../components/SelectAddressModal';
import { createWalletFromJSON } from '../../store/services/wallet';
import type { LoginWithWallet } from '../../types/loginPage';

type Props = {
    authenticated: boolean,
    loginWithMetamask: () => void,
    loginWithWallet: LoginWithWallet => void,
    loginWithTrezorWallet: () => void,
    loginWithLedgerWallet: () => void,
    removeNotification: any => void,
    generateTrezorAddresses: () => void
};

//TODO: Remove Notification handling

type State = {
    view: string,
    metamaskStatus: 'unlocked' | 'locked' | 'undefined',
    isSelectAddressModalOpen: boolean,
    walletType: string,
    currentAddresses: Array,
    currentDPath: string
};

class LoginPage extends React.PureComponent<Props, State> {
    state = {
        view: 'loginMethods',
        metamaskStatus: 'undefined',
        walletType: '',
        isSelectAddressModalOpen: false,
        currentDPath: ''
    };

    openSelectAddressModal = async () => {
        let { walletType, serializedPath, addresses } = await this.props.generateTrezorAddresses();

        this.setState({
            isSelectAddressModalOpen: true,
            walletType,
            currentAddresses: addresses,
            currentDPath: 'm/' + serializedPath
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
                authenticated
            },
            state: { view, metamaskStatus, isSelectAddressModalOpen, walletType, currentAddresses, currentDPath },
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
            return <Redirect to='/wallet' />;
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
                />
                <SelectAddressModal
                    title="Select Trezor Address"
                    isOpen={isSelectAddressModalOpen}
                    handleClose={this.closeSelectAddressModal}
                    walletType={walletType}
                    currentAddresses={currentAddresses}
                    currentDPath={currentDPath}
                />
            </Wrapper>
        );
    }
}

const Wrapper = styled.div`
    height: 100%;
`;

export default LoginPage;
