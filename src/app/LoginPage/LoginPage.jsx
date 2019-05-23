// @flow
import React from 'react'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import LoginPageRenderer from './LoginPageRenderer'
import type { LoginWithWallet } from '../../types/loginPage'
// import { TrezorSigner } from '../../store/services/signer/trezor'
import {
  createWalletFromMnemonic,
  createWalletFromPrivateKey,
  // getEncryptedWalletAddress,
} from '../../store/services/wallet'

type Props = {
  authenticated: boolean,
  loginWithWallet: LoginWithWallet => void,
  loginWithTrezorWallet: Object => void,
  loginWithLedgerWallet: () => void,
  removeNotification: any => void,
  getTrezorPublicKey: (Object, ?string) => void
}

type State = {
  selectedTabId: string,
  privateKeyStatus: string,
  privateKey: string,
  mnemonicStatus: string,
  mnemonic: string,
  password: string,
  passwordStatus: string,
}

class LoginPage extends React.PureComponent<Props, State> {

  state = {
    selectedTabId: 'private-key',
    privateKeyStatus: 'initial',
    privateKey: '',
    mnemonicStatus: 'initial',
    mnemonic: '',
    password: '',
    passwordStatus: 'initial',
  }

  handleTabChange = (selectedTabId: string) => {
    this.setState({ 
      selectedTabId,
      privateKeyStatus: 'initial',
      mnemonicStatus: 'initial',
      privateKey: '',
      mnemonic: '',
      password: '',
      passwordStatus: 'initial',
    })
  }

  checkPrivateValid = (privateKey) => {
    (privateKey.length === 66) ? this.setState({isPrivateKeyValid: true}) : this.setState({isPrivateKeyValid: false})
  }

  handlePrivateKeyChange = (e) => {
    if (e.target.value.length !== 66) {
      this.setState({ 
        privateKey: e.target.value,
        privateKeyStatus: 'invalid',
      })
      return
    }

    this.setState({
      privateKey: e.target.value,
      privateKeyStatus: 'valid',
    })
  }

  handleMnemonicChange = (e) => {
    if (e.target.value.trim().split(' ').length !== 12) {
      this.setState({ 
        mnemonicStatus: 'invalid',
        mnemonic: e.target.value,
      })
      return
    }

    this.setState({
      mnemonicStatus: 'valid',
      mnemonic: e.target.value,
    })
  }

  handlePasswordChange = (e) => {
    const password = e.target.value
    const validationPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/g

    if (!validationPasswordRegex.test(password)) {
      this.setState({ 
        passwordStatus: 'invalid',
        password,
      })

      return
    }

    this.setState({ 
      passwordStatus: 'valid',
      password,
    })
  }

  unlockWalletWithPrivateKey = async () => {
    const { 
      props: { loginWithWallet },
      state: { privateKey, privateKeyStatus },
    } = this

    if (privateKeyStatus !== 'valid') return

    const wallet = await createWalletFromPrivateKey(privateKey)

    if (!wallet) {
      this.setState({ privateKeyStatus: 'invalid' })
      return
    }

    loginWithWallet(wallet)
  }

  unlockWalletWithMnemonic = async () => {
    const {
      props: { loginWithWallet },
      state: { mnemonicStatus, mnemonic },
    } = this

    if (mnemonicStatus !== 'valid') return

    const wallet = await createWalletFromMnemonic(mnemonic)

    if (!wallet) {
      this.setState({ mnemonicStatus: 'invalid' })
      return
    }

    loginWithWallet(wallet)
  }

  render() {

    const {
      props: {
        authenticated,
      },
      state: { 
        selectedTabId, 
        privateKeyStatus, 
        privateKey,
        mnemonicStatus,
        mnemonic,
        password,
        passwordStatus,
      },
      handleTabChange,
      handlePrivateKeyChange,
      unlockWalletWithPrivateKey,
      handleMnemonicChange,
      unlockWalletWithMnemonic,
      handlePasswordChange,
    } = this

    // go to markets by default
    if (authenticated) {
      return <Redirect to="/markets" />
    }

    return (
      <Wrapper>
        <LoginPageRenderer
          selectedTabId={selectedTabId}
          handleTabChange={handleTabChange}
          privateKeyStatus={privateKeyStatus}
          privateKey={privateKey}
          handlePrivateKeyChange={handlePrivateKeyChange}
          unlockWalletWithPrivateKey={unlockWalletWithPrivateKey}
          mnemonicStatus={mnemonicStatus}
          mnemonic={mnemonic}
          handleMnemonicChange={handleMnemonicChange}
          unlockWalletWithMnemonic={unlockWalletWithMnemonic}
          password={password}
          passwordStatus={passwordStatus}
          handlePasswordChange={handlePasswordChange} />
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  height: 100%;
`

export default LoginPage
