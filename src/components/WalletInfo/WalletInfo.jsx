import React from 'react';
import WalletInfoRenderer from './WalletInfoRenderer';

export default class WalletInfo extends React.PureComponent {
  state = { isModalOpen: false };

  handleModalClose = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  render() {
    const {
      props: { accountAddress, gasPrice, gas, tomoBalance },
      state: { currentBlock, isModalOpen },
      handleModalClose,
      toggleBalance
    } = this;

    return (
      <WalletInfoRenderer
        gasPrice={gasPrice}
        gas={gas}
        balance={tomoBalance}
        isModalOpen={isModalOpen}
        currentBlock={currentBlock}
        accountAddress={accountAddress}
        toggleBalance={toggleBalance}
        handleModalClose={handleModalClose}
      />
    );
  }
}
