import React from 'react'
import styled from 'styled-components'
import { Tab, Tabs } from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'

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
            <Tab id="metamask" title="MetaMask" panel={<MetaMask />} />
            <Tab id="trezor" title="Trezor" panel={<TrezorWallet />} />
            <Tab id="private-key" title="Private Key" panel={<PrivateKeyWallet />} />
            <Tab id="seed-phrase" title="Mnemonic Phrase" panel={<MnemonicWallet />} />
            <Tab id="wallet-connect" title="Wallet Connect" panel={<WalletConnect />} />         
          </TabsWrapper>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  margin-top: 50px;
  margin-bottom: 55px;
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

