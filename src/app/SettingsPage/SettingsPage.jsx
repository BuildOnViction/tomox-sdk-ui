// @flow

import React from 'react';
import { Redirect } from 'react-router-dom';
import { getLocalStorageWallets } from '../../utils/helpers';
import WalletSettingsForm from '../../components/WalletSettingsForm';
import SignerSettingsForm from '../../components/SignerSettingsForm';
import { Box } from '../../components/Common';

import type { Wallet } from '../../types/wallets';
import type { Address } from '../../types/common';

type Props = {
  authenticated: boolean
};

type State = {
  wallets: Array<Wallet>
};

class SettingsPage extends React.PureComponent<Props, State> {
  state = {
    wallets: getLocalStorageWallets()
  };

  removeWallet = (address: Address) => {
    localStorage.removeItem(address);
    this.setState({ wallets: getLocalStorageWallets() });
  };

  render() {
    // const { pvtKeyLocked, togglePvtKeyLock } = this.props
    const { wallets } = this.state;

    if (!this.props.authenticated) {
      return <Redirect to="/login" />;
    }

    return (
      <React.Fragment>
        <Box width={500} m={3}>
          <WalletSettingsForm
            // pvtKeyLocked={pvtKeyLocked}
            // togglePvtKeyLock={togglePvtKeyLock}
            wallets={wallets}
            removeWallet={this.removeWallet}
          />
        </Box>
        <Box width={500} m={3}>
          <SignerSettingsForm />
        </Box>
      </React.Fragment>
    );
  }
}

export default SettingsPage;
