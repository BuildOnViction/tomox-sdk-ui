import React from 'react'
import styled from 'styled-components'
import { Label, Tab, Tabs, Button } from '@blueprintjs/core'
import { DarkMode, Theme, SmallText } from '../../components/Common'
// import type { CreateWalletParams } from '../../types/createWallet'
import { Link } from "react-router-dom"

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
}

class LoginPageRenderer extends React.PureComponent<Props> {

  render() {
    const {
      selectedTabId,
      handleTabChange,
      privateKeyStatus,
      privateKey,
      mnemonicStatus,
      mnemonic,
      handlePrivateKeyChange, 
      unlockWalletWithPrivateKey,
      handleMnemonicChange,
      unlockWalletWithMnemonic,
      password,
      passwordStatus,
      handlePasswordChange,
    } = this.props

    return (
      <Wrapper>
        <ImportWalletWrapper>
          <HeaderTitle>Import your Wallet</HeaderTitle>
          <SubTitle>If you don't have a wallet go <LinkWrapper to="/create">Create new wallet</LinkWrapper></SubTitle>

          <TabsWrapper id="import-list" onChange={handleTabChange} selectedTabId={selectedTabId}>
            <Tab 
              id="private-key" 
              title="Private Key" 
              panel={
                <PrivateKey 
                  privateKey={privateKey} 
                  privateKeyStatus={privateKeyStatus} 
                  handlePrivateKeyChange={handlePrivateKeyChange} 
                  unlockWalletWithPrivateKey={unlockWalletWithPrivateKey}
                  password={password}
                  passwordStatus={passwordStatus}
                  handlePasswordChange={handlePasswordChange} />
              } />

            <Tab 
              id="seed-phrase" 
              title="Mnemonic Phrase" 
              panel={
                <MnemonicPhrase 
                  mnemonic={mnemonic} 
                  mnemonicStatus={mnemonicStatus} 
                  handleMnemonicChange={handleMnemonicChange} 
                  unlockWalletWithMnemonic={unlockWalletWithMnemonic}
                  password={password}
                  passwordStatus={passwordStatus}
                  handlePasswordChange={handlePasswordChange} />
              } />

            <Tab id="ledger" title="Ledger Nano S" panel={<div></div>} />
            <Tab id="trezor" title="Trezor" panel={<div></div>} />
          </TabsWrapper>
        </ImportWalletWrapper>
      </Wrapper>
    )
  }
}

const PrivateKey = (props) => {
  const { 
    privateKey, 
    privateKeyStatus, 
    handlePrivateKeyChange, 
    unlockWalletWithPrivateKey,
    password,
    passwordStatus,
    handlePasswordChange,
  } = props

  return (
    <React.Fragment>
      <LabelWrapper>
        <LabelTitle>Enter your private key</LabelTitle> 
        <InputGroupWrapper marginBottom="5px" type="text" value={privateKey} isInvalid={privateKeyStatus === 'invalid'} onChange={handlePrivateKeyChange} />
      </LabelWrapper>
      {(privateKeyStatus === 'invalid') && (<ErrorMessage>Private key invalid</ErrorMessage>)}

      <LabelWrapper>
        <LabelTitle>Temporary session password</LabelTitle> 
        <InputGroupWrapper type="password" value={password} onChange={handlePasswordChange} isInvalid={passwordStatus === 'invalid'} marginBottom="5px" />
      </LabelWrapper>          
      <SmallText>Password need 8 or more characters, at least an upper case, symbol and a number</SmallText>

      <ButtonWrapper onClick={unlockWalletWithPrivateKey} disabled={passwordStatus !== 'valid' || privateKeyStatus !== 'valid'}>Unlock Wallet</ButtonWrapper>
    </React.Fragment>
  )
}

const MnemonicPhrase = (props) => {
  const { 
    mnemonic,
    mnemonicStatus, 
    handleMnemonicChange, 
    unlockWalletWithMnemonic,
    password, 
    passwordStatus,
    handlePasswordChange,
  } = props

  return (
    <React.Fragment>
      <LabelWrapper>
        <LabelTitle>Please enter your 12 word phrase</LabelTitle> 
        <TextAreaWrapper value={mnemonic} isInvalid={mnemonicStatus === 'invalid'} onChange={handleMnemonicChange} />
      </LabelWrapper>
      {(mnemonicStatus === 'invalid') && (<ErrorMessage>Invalid Mnemonic. Mnemonic must be 12 words long</ErrorMessage>)}

      <LabelWrapper>
        <LabelTitle>Temporary session password</LabelTitle> 
        <InputGroupWrapper type="password" value={password} onChange={handlePasswordChange} isInvalid={passwordStatus === 'invalid'} marginBottom="5px" />
      </LabelWrapper>          
      <SmallText>Password need 8 or more characters, at least an upper case, symbol and a number</SmallText>

      <ButtonWrapper disabled={passwordStatus !== 'valid' || mnemonicStatus !== 'valid'} onClick={unlockWalletWithMnemonic}>Unlock Wallet</ButtonWrapper>
    </React.Fragment>
  )
}

export default LoginPageRenderer

const Wrapper = styled.div``

const TabsWrapper = styled(Tabs)`
  margin-top: 35px;

  .bp3-tab-list {
    justify-content: space-between;

    .bp3-tab {
      margin: 0;

      &:last-child {
        text-align: right;
      }
    }

    .bp3-tab-indicator-wrapper {
      display: block;

      .bp3-tab-indicator {
        height: 2px;
        background-color: ${DarkMode.ORANGE};
      }
    }
  }

  .bp3-tab-panel {
    padding: 45px 25px 30px;
  }
`

const TextAreaWrapper = styled.textarea`
  width: 100%;
  min-height: 128px !important;
  padding: 15px;
  background-color: ${DarkMode.BLACK};
  margin-bottom: 5px;
  resize: none;
  font-size: ${Theme.FONT_SIZE_LG};
  color: ${DarkMode.WHITE};
  border: ${props => props.isInvalid ? `1px solid ${DarkMode.RED} !important` : 'none'};

  &:focus {
    border: 1px solid ${DarkMode.ORANGE};
  }
`

const ImportWalletWrapper = styled.div`
  width: 395px;
  margin: 50px auto 0;
`

const HeaderTitle = styled.h1`
  color: ${DarkMode.WHITE};
  font-size: 24px;
  font-weight: 300;
  text-align: center;
  line-height: 24px;
`

const LinkWrapper = styled(Link)`
  color: ${DarkMode.ORANGE};

  &:hover {
    color: ${DarkMode.DARK_ORANGE};
  }
`

const SubTitle = styled.div`
  text-align: center;
`

const LabelWrapper = styled(Label)`
  margin-bottom: 0 !important;
  &:not(:first-child) {
    margin-top: 35px;
  }
`

const LabelTitle = styled.div`
  margin-bottom: 25px;
`

const ButtonWrapper = styled(Button)`
  display: block;
  margin-top: 45px;
  width: 100%;
  text-align: center;
  color: ${DarkMode.BLACK} !important;
  border-radius: 0;
  background-color: ${DarkMode.ORANGE} !important;
  box-shadow: none !important;
  background-image: none !important;
  height: 40px;
  &:hover {
    background-color: ${DarkMode.DARK_ORANGE} !important;
  }

  &.bp3-disabled {
    cursor: default !important;
    background-color: ${DarkMode.GRAY} !important;
  }
`

const InputGroupWrapper = styled.input`
  height: 50px;
  color: ${DarkMode.WHITE};
  font-size: ${Theme.FONT_SIZE_LG};
  padding: 15px;
  margin-top: 0 !important;
  margin-bottom: ${props => props.marginBottom ? props.marginBottom : '35px'};
  background: ${DarkMode.BLACK};
  border: ${props => props.isInvalid ? `1px solid ${DarkMode.RED} !important` : 'none'};
  width: 100%;

  &:focus {
    border: 1px solid ${DarkMode.ORANGE};
  }
`

const ErrorMessage = styled.div`
  color: ${DarkMode.RED};
  font-size: 12px;
`
