// @flow
import React from 'react'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import LoginPageRenderer from './LoginPageRenderer'
import type { LoginWithWallet } from '../../types/loginPage'
// import { TrezorSigner } from '../../store/services/signer/trezor'
import { LedgerWallet } from '../../store/services/signer/ledger'
import {
  createWalletFromMnemonic,
  createWalletFromPrivateKey,
  // getEncryptedWalletAddress,
} from '../../store/services/wallet'
import AddressGenerator from '../../store/services/device/addressGenerator'

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
  isOpenAddressesDialog: boolean,
  addresses: Array<Object>,
  indexAddress: number,
  isOpenHdPathDialog: boolean,
}

const hdPaths = [
  {path: "m/44'/889'/0'/0", type: "TomoChain App"},
  {path: "m/44'/60'/0'", type: "Ledger Live"},
  {path: "m/44'/60'/0'/0", type: "Ethereum App"},
].map((m, index) => ({ ...m, rank: index + 1 }))

class LoginPage extends React.PureComponent<Props, State> {

  state = {
    // selectedTabId: 'private-key',
    selectedTabId: 'ledger',
    privateKeyStatus: 'initial',
    privateKey: '',
    mnemonicStatus: 'initial',
    mnemonic: '',
    password: '',
    passwordStatus: 'initial',
    isOpenAddressesDialog: false,
    isOpenHdPathDialog: false,
    addresses: [],
    indexAddress: 0,
    indexHdPathActive: 0,
  }

  createLedgerSigner = async () => {
    new LedgerWallet()
    const eth = await window.signer.instance.create()
    window.signer.instance.eth = eth
  }
  
  getMultipleAddresses = async (offset, limit, init) => {
    // limit fix is 5
    if (init) {
      const { indexHdPathActive } = this.state
      const address = await window.signer.instance.getAddress(hdPaths[indexHdPathActive].path)
      this.generator = new AddressGenerator(address)
    }
    
    const nextAddresses = []

    for (let index = offset; index < offset + limit; index++) {
        const addressString = this.generator.getAddressString(index)

        const address = {
            addressString,
            index,
            balance: -1,
        }

        nextAddresses.push(address)
    }

    this.setState({
      indexAddress: offset + limit,
      addresses: nextAddresses,
    })
  }

  prevAddresses = () => {
    let offset = this.state.indexAddress - 10
    offset = (offset > 0) ? offset : 0
    this.getMultipleAddresses(offset, 5, false)
  }

  nextAddresses = () => {
    this.getMultipleAddresses(this.state.indexAddress, 5, false)
  }

  handleTabChange = async (selectedTabId: string) => {
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

  toggleAddressesDialog = (status) => {
    (status === 'open') ? this.setState({ isOpenAddressesDialog: true }) : this.setState({ isOpenAddressesDialog: false })
  }

  toggleHdPathDialog = (status) => {
    (status === 'open') ? this.setState({ isOpenHdPathDialog: true, indexHdPathActive: 0 }) : this.setState({ isOpenHdPathDialog: false, indexHdPathActive: 0 })
  }

  handleHdPathChange = (path) => {
    this.setState({ indexHdPathActive: path.rank - 1 })
  }

  handleSelectedHdPath = async () => {
    await this.createLedgerSigner()
    await this.getMultipleAddresses(0, 5, true) // Init get addresses
    this.toggleHdPathDialog('close')
    this.toggleAddressesDialog('open')
  }

  render() {

    const {
      props: {
        authenticated,
        loginWithLedgerWallet,
      },
      state: { 
        selectedTabId, 
        privateKeyStatus, 
        privateKey,
        mnemonicStatus,
        mnemonic,
        password,
        passwordStatus,
        addresses,
        isOpenAddressesDialog,
        isOpenHdPathDialog,
        indexHdPathActive,
      },
      handleTabChange,
      handlePrivateKeyChange,
      unlockWalletWithPrivateKey,
      handleMnemonicChange,
      unlockWalletWithMnemonic,
      handlePasswordChange,
      toggleAddressesDialog,
      toggleHdPathDialog,
      handleHdPathChange,
      handleSelectedHdPath,
      prevAddresses,
      nextAddresses,
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
          handlePasswordChange={handlePasswordChange}
          addresses={addresses}
          isOpenAddressesDialog={isOpenAddressesDialog}
          toggleAddressesDialog={toggleAddressesDialog}
          loginWithLedgerWallet={loginWithLedgerWallet}
          isOpenHdPathDialog={isOpenHdPathDialog}
          toggleHdPathDialog={toggleHdPathDialog}
          handleHdPathChange={handleHdPathChange}
          indexHdPathActive={indexHdPathActive}
          hdPaths={hdPaths}
          handleSelectedHdPath={handleSelectedHdPath}
          prevAddresses={prevAddresses}
          nextAddresses={nextAddresses} />
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  height: 100%;
`

export default LoginPage
