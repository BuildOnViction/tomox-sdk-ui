import React from 'react'
import styled from 'styled-components'
import { Tab, Tabs } from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'

import { KeyIcon, Trezor } from '../../components/Icons'
import { TmColors } from '../../components/Common'
import { Link } from "react-router-dom"
import MetaMask from '../../components/MetaMask'
import TrezorWallet from '../../components/TrezorWallet'
import PrivateKeyWallet from '../../components/PrivateKeyWallet'
import MnemonicWallet from '../../components/MnemonicWallet'
import LedgerWallet from '../../components/LedgerWallet'
import Pantograph from '../../components/Pantograph'
import WalletConnect from '../../components/WalletConnect'

type Props = {
  selectedTabId: string,
  handleTabChange: void => void,
  privateKeyStatus: string,
  privateKey: string,
  mnemonicStatus: string,
  mnemonic: string,
  handlePrivateKeyChange: void => void, 
  unlockWalletWithPrivateKey: void => void,
  handleMnemonicChange: void => void,
  unlockWalletWithMnemonic: void => void,
  password: string,
  handlePasswordChange: void => void,
  unlockWalletWithMetaMask: void => void,
  error: object,
}

class LoginPageRenderer extends React.PureComponent<Props> {

  render() {
    const {
      selectedTabId,
      handleTabChange,
      selectedOtherWallet,
      handleOtherWalletChange,
    } = this.props

    return (
      <Wrapper>
          <HeaderTitle><FormattedMessage id="unlockWalletPage.title" /></HeaderTitle>
          <SubTitle><FormattedMessage id="unlockWalletPage.subTitlePart1" /> <LinkWrapper to="/create"><FormattedMessage id="unlockWalletPage.subTitlePart2" /></LinkWrapper></SubTitle>

          <TabsWrapper 
            id="import-list" 
            onChange={handleTabChange} 
            selectedTabId={selectedTabId}
            renderActiveTabPanelOnly={true}>
            <Tab id="ledger" title="Ledger Nano S" panel={<LedgerWallet />} />
            <Tab id="pantograph" title="Pantograph" panel={<Pantograph />} />
            <Tab id="wallet-connect" title="Wallet Connect" panel={<WalletConnect />} />
            <Tab id="metamask" title="MetaMask" panel={<MetaMask />} />
            <Tab 
              id="others" 
              title="Others" 
              panel={
                <OthersPanel 
                  selectedOtherWallet={selectedOtherWallet} 
                  handleOtherWalletChange={handleOtherWalletChange} 
                />
              } 
            />
          </TabsWrapper>
      </Wrapper>
    )
  }
}

const OthersPanel = ({ selectedOtherWallet, handleOtherWalletChange }) => {
  return (<>
    {!selectedOtherWallet && <OtherWalletButtons handleOtherWalletChange={handleOtherWalletChange} />}
    {selectedOtherWallet && (
      <>
        <WalletButtonsHeader>
          <BackButton onClick={() => handleOtherWalletChange('')}><i className="fa fa-long-arrow-left" aria-hidden="true" /> Back</BackButton>
        </WalletButtonsHeader>
        <OtherWalletContent selectedOtherWallet={selectedOtherWallet} />
      </>
    )}
  </>)
}

const OtherWalletButtons = ({ handleOtherWalletChange }) => {
  return (<Content>
    <WalletButton onClick={() => handleOtherWalletChange('trezor')}>Trezor <Trezor size={20} /></WalletButton>
    <WalletButton onClick={() => handleOtherWalletChange('privateKey')}>Private Key <KeyIcon size={20} /></WalletButton>
    <WalletButton onClick={() => handleOtherWalletChange('mnemonic')}>Mnemonic Phrase <KeyIcon size={20} /></WalletButton>
  </Content>)
}

const OtherWalletContent = ({ selectedOtherWallet }) => {
  switch (selectedOtherWallet) {
    case 'trezor':
      return <TrezorWallet />
    case 'privateKey':
      return <PrivateKeyWallet />
    default:
      return <MnemonicWallet />
  }
}

const Wrapper = styled.div`
  margin-top: 50px;
  margin-bottom: 55px;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 395px;
  margin: 0 auto;
`

const WalletButtonsHeader = styled.div`
  margin-bottom: 25px;
  padding: 10px;
`

const BackButton = styled.span`
  cursor: pointer;
  display: inline-block;

  &:hover {
    color: #fff;
  }
`

const WalletButton = styled.div`
  width: 100%;
  cursor: pointer;
  margin-bottom: 15px;
  padding: 15px;
  border: 1px solid #3f4a6f;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;

  &:hover {
    color: #ff9a4d;
  }
`

const TabsWrapper = styled(Tabs)`
  margin: 35px auto 0 auto;
  width: fit-content;

  .bp3-tab-list {
    .bp3-tab {
      user-select: none;
    }

    .bp3-tab-indicator-wrapper {
      display: block;


      .bp3-tab-indicator {
        height: 2px;
        background-color: ${TmColors.ORANGE};
      }
    }

    .bp3-tab {
      color: ${TmColors.LIGHT_GRAY};
    }

    .bp3-tab[aria-selected="true"],
    .bp3-tab:hover {
      color: ${TmColors.WHITE};
    }
  }

  .bp3-tab-panel {
    padding: 45px 25px 30px;
  }
`

const HeaderTitle = styled.h1`
  color: ${TmColors.WHITE};
  font-size: 24px;
  font-weight: 300;
  text-align: center;
  line-height: 24px;
`

const LinkWrapper = styled(Link)`
  color: ${TmColors.ORANGE};

  &:hover {
    color: ${TmColors.DARK_ORANGE};
  }
`

const SubTitle = styled.div`
  text-align: center;
`

export default LoginPageRenderer

