import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { Callout, Card, Intent, Spinner, Tag } from '@blueprintjs/core';
import WalletLoginForm from '../../components/WalletLoginForm';
import CreateWalletModal from '../../components/CreateWalletModal';
import MetamaskIcon from '../../components/Icons/Metamask';
import { KeyIcon, WalletIcon, Trezor } from '../../components/Icons';
import { Centered, Divider, LargeText, Colors } from '../../components/Common';
import type { CreateWalletParams } from '../../types/createWallet';

type Props = {
  view: string,
  showWalletLoginForm: CreateWalletParams => void,
  showLoginMethods: () => void,
  loginWithMetamask: void => void,
  loginWithWallet: void => void,
  openSelectAddressModal: void => void,
  loginWithTrezorWallet: Object => void,
  loginWithLedgerWallet: void => void
};

const LoginPageRenderer = (props: Props) => {
  const {
    view,
    loginWithMetamask,
    loginWithWallet,
    openSelectAddressModal,
    loginWithTrezorWallet,
    loginWithLedgerWallet,
    showCreateWallet,
    hideModal,
    showWalletLoginForm,
    metamaskStatus,
    showLoginMethods,
    walletCreated
  } = props;

  const views = {
    loginMethods: (
      <LoginMethodsView
        showWalletLoginForm={showWalletLoginForm}
        loginWithMetamask={loginWithMetamask}
        openSelectAddressModal={openSelectAddressModal}
        loginWithTrezorWallet={loginWithTrezorWallet}
        loginWithLedgerWallet={loginWithLedgerWallet}
        showCreateWallet={showCreateWallet}
        metamaskStatus={metamaskStatus}
      />
    ),
    wallet: (
      <WalletLoginFormView
        loginWithWallet={loginWithWallet}
        showLoginMethods={showLoginMethods}
      />
    ),
    createWallet: (
      <CreateWalletModal
        walletCreated={walletCreated}
        hideModal={hideModal}
        visible={view === 'createWallet'}
      />
    ),
    loading: <LoginLoadingView />
  };

  return views[view];
};

const LoginMethodsView = (props: Props) => {
  const {
    showWalletLoginForm,
    loginWithMetamask,
    openSelectAddressModal,
    metamaskStatus,
    showCreateWallet
  } = props;
  return (
    <Wrapper>
      <Announcement>
        <Callout intent="success" title="Important notice">
          <AnnouncementMessages>
            <FormattedMessage
              id="loginPage.announcement"
              values={{
                link: (
                  <a href="https://tomochain.com/">https://tomochain.com/</a>
                )
              }}
            />
            <Reminder>
              <FormattedMessage id="loginPage.noPlugins" />
            </Reminder>
            <Reminder>
              <FormattedMessage id="loginPage.noPhoneCalls" />
            </Reminder>
            <Reminder>
              <FormattedMessage id="loginPage.noOfficialStaffs" />
            </Reminder>
            <Reminder>
              <FormattedMessage id="loginPage.noDisclosure" />
            </Reminder>
          </AnnouncementMessages>
        </Callout>
      </Announcement>
      <LoginMethods>
        <LoginMethodsHeading>
          <FormattedMessage id="loginPage.loginMethods" />
        </LoginMethodsHeading>
        <LoginCards>
          <LoginCard onClick={loginWithMetamask}>
            <MetamaskIcon size={100} />
            <Heading>
              <FormattedMessage id="loginPage.metamask" />
            </Heading>
            <MetamaskStatusTag>
              {metamaskStatuses[metamaskStatus]}
            </MetamaskStatusTag>
          </LoginCard>
          <LoginCard onClick={openSelectAddressModal}>
            <Trezor size={100} />
            <Heading>
              <FormattedMessage id="loginPage.trezorWallet" />
            </Heading>
            <HardwareWalletStatusTag>
              {recommendedStatus}
            </HardwareWalletStatusTag>
          </LoginCard>
          <LoginCard onClick={showWalletLoginForm}>
            <KeyIcon size={100} />
            <Heading>
              <FormattedMessage id="loginPage.wallet" />
            </Heading>
          </LoginCard>
          <LoginCard onClick={showCreateWallet}>
            <WalletIcon size={100} color={Colors.WHITE} />
            <Heading>
              <FormattedMessage id="loginPage.createWallet" />
            </Heading>
          </LoginCard>
        </LoginCards>
      </LoginMethods>
    </Wrapper>
  );
};

const WalletLoginFormView = (props: Props) => {
  const { loginWithWallet, showLoginMethods } = props;
  return (
    <WalletLoginViewWrapper>
      <WalletLoginForm
        loginWithWallet={loginWithWallet}
        showLoginMethods={showLoginMethods}
      />
    </WalletLoginViewWrapper>
  );
};

const LoginLoadingView = (props: Props) => {
  return (
    <Centered>
      <Spinner large intent="primary" />
      <Divider />
      <LargeText intent="primary">Logging In ...</LargeText>
    </Centered>
  );
};

export default LoginPageRenderer;

const Wrapper = styled.div`
  display: grid;
  padding-left: 2em;
  padding-right: 2em;
  padding-top: 2em;
`;

const WalletLoginViewWrapper = styled.div`
  margin-top: 5em;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Announcement = styled.section``;

const Heading = styled.h4`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Reminder = styled.div``;

const LoginMethods = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const LoginMethodsHeading = styled.h3`
  display: flex;
  justify-content: center;
  padding-top: 60px;
`;

const LoginCards = styled.div`
  padding-top: 20px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const AnnouncementMessages = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
`;

const LoginCard = styled(Card).attrs({
  interactive: true
})`
  margin: 10px;
  height: 13em;
  width: 13em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MetamaskStatusTag = styled(Tag).attrs({
  intent: Intent.SUCCESS,
  interactive: true,
  minimal: true,
  textalign: 'center'
})``;

const HardwareWalletStatusTag = styled(Tag).attrs({
  intent: Intent.SUCCESS,
  interactive: true,
  minimal: true,
  textalign: 'center'
})``;

const metamaskStatuses = {
  undefined: 'Not found',
  locked: 'Locked',
  unlocked: 'Connected'
};

const recommendedStatus = 'Recommended';
