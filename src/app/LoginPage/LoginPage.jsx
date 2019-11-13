// @flow
import React from 'react'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import { utils } from 'ethers'
import BigNumber from 'bignumber.js'
import { FormattedMessage } from 'react-intl'

import LoginPageRenderer from './LoginPageRenderer'
import type { LoginWithWallet } from '../../types/loginPage'

import { LedgerWallet } from '../../store/services/signer/ledger'
import {
  createWalletFromMnemonic,
  createWalletFromPrivateKey,
  // getEncryptedWalletAddress,
} from '../../store/services/wallet'
import AddressGenerator from '../../store/services/device/addressGenerator'
import { validatePassword } from '../../utils/helpers'

type Props = {
  authenticated: boolean,
  loginWithWallet: LoginWithWallet => void,
  loginWithTrezorWallet: Object => void,
  loginWithLedgerWallet: () => void,
  removeNotification: any => void,
  getTrezorPublicKey: (Object, ?string) => void,
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
  ledgerError: object,
  error: object,
}

const errorList = {
  "TransportOpenUserCancelled": <FormattedMessage id="unlockWalletPage.ledger.errorNoDevice" />,
  "26368": <FormattedMessage id="unlockWalletPage.ledger.error26368" />,
  "26628": <FormattedMessage id="unlockWalletPage.ledger.error26628" />,
}

const hdPaths = [
  {path: "m/44'/889'/0'/0", type: "TomoChain App"},
  {path: "m/44'/60'/0'", type: "Ledger Live"},
  {path: "m/44'/60'/0'/0", type: "Ethereum App"},
].map((m, index) => ({ ...m, rank: index + 1 }))

class LoginPage extends React.PureComponent<Props, State> {

  state = {
    selectedTabId: 'trezor',
    privateKeyStatus: 'initial',
    privateKey: '',
    mnemonicStatus: 'initial',
    mnemonic: '',
    password: '',
    passwordStatus: 'initial',
    isOpenAddressesDialog: false,
    isOpenSelectHdPathModal: false,
    addressActive: null,
    addresses: [],
    indexAddress: 0,
    indexHdPathActive: 0,
    ledgerError: null,
    loading: false,
  }

  createLedgerSigner = async () => {
    try {
      const { path } = hdPaths[this.state.indexHdPathActive]
      new LedgerWallet(path)
      await window.signer.instance.create()
    } catch(e) {
      throw e
    }
  }
  
  getMultipleAddresses = async (offset, limit = 5, init) => {
    try {
      if (init) {
        const { indexHdPathActive } = this.state
        const publicKey = await window.signer.instance.getPublicKey(hdPaths[indexHdPathActive].path)
        if (!publicKey) return
        this.generator = new AddressGenerator(publicKey)
      }
      
      const getBalancePromises = []

      for (let index = offset; index < offset + limit; index++) {
          const addressString = this.generator.getAddressString(index)

          const address = {
              addressString,
              index,
              balance: -1,
          }

          getBalancePromises.push(this.getBalance(address))
      }

      const addressesWithBalance = await Promise.all(getBalancePromises)

      this.setState({
        indexAddress: offset + limit,
        addresses: addressesWithBalance,
      })

      return addressesWithBalance
    } catch(e) {
      throw e
    }
  }

  getBalance = async (address: Object, index: number) => {
    const result = await this.props.getBalance(address.addressString)
    address.balance = BigNumber(utils.formatEther(result)).toFormat(3)

    return address
  }

  prevAddresses = () => {
    let offset = this.state.indexAddress - 10
    offset = (offset > 0) ? offset : 0
    this.getMultipleAddresses(offset, 5, false)
  }

  nextAddresses = () => {
    this.getMultipleAddresses(this.state.indexAddress, 5, false)
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
      error: null,
    })
  }

  handlePrivateKeyChange = (e) => {
    if (e.target.value.length === 66 || e.target.value.length === 64) {
      this.setState({
        privateKey: e.target.value,
        privateKeyStatus: 'valid',
      })
      return 
    }

    this.setState({ 
      privateKey: e.target.value,
      privateKeyStatus: 'invalid',
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

    if (!validatePassword(password)) {
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
      state: { privateKey, privateKeyStatus, password, passwordStatus },
    } = this

    if (privateKeyStatus !== 'valid' || passwordStatus !== 'valid') return

    const privateKeyString = (privateKey.length === 64) ? `0x${privateKey}` : privateKey
    const { wallet } = await createWalletFromPrivateKey(privateKeyString)

    if (!wallet) {
      this.setState({ privateKeyStatus: 'invalid' })
      return
    }

    loginWithWallet(wallet, password)
  }

  unlockWalletWithPrivateKeyOnKeyPress = async (event) => {
    if (event.key !== 'Enter') return

    await this.unlockWalletWithPrivateKey()
  }

  unlockWalletWithMnemonic = async () => {
    const {
      props: { loginWithWallet },
      state: { mnemonicStatus, mnemonic, password, passwordStatus },
    } = this

    if (mnemonicStatus !== 'valid' || passwordStatus !== 'valid') return

    const { wallet } = await createWalletFromMnemonic(mnemonic)

    if (!wallet) {
      this.setState({ mnemonicStatus: 'invalid' })
      return
    }

    loginWithWallet(wallet, password)
  }

  toggleSelectHdPathModal = (status) => {
    if (status === 'open') {
      return this.setState({ isOpenSelectHdPathModal: true })
    } 
    
    this.setState({ 
      indexHdPathActive: 0,
      isOpenSelectHdPathModal: false,
      loading: false,
    })
  }

  toggleAddressesDialog = (status) => {
    if (status === 'open') {
      return this.setState({ isOpenAddressesDialog: true })
    } 
    
    this.setState({ 
      isOpenAddressesDialog: false,
      addressActive: null,
    })
  }

  handleHdPathChange = async (path) => {
    this.setState({ 
      indexHdPathActive: path.rank - 1,
      ledgerError: null,
      loading: false,
    })
  }

  connectToLedger = async () => {    
    try {
      this.setState({ loading: true })
      await this.createLedgerSigner()
      
      const addresses = await this.getMultipleAddresses(0, 5, true) // Init get addresses
      
      if (addresses.length > 0) {
        this.setState({ 
          ledgerError: null,
          loading: false,
        })

        this.toggleAddressesDialog('open')
        this.toggleSelectHdPathModal('close')
      }
    } catch(e) {
      console.log(e)
      this.setState({ 
        ledgerError: e,
        addresses: [],
        loading: false,
      })
    }
  }

  chooseAddress = (address) => {
    this.setState({ addressActive: address })
  }

  unlockWalletWithLedger = async () => {
    try {
      await this.props.loginWithLedgerWallet(this.state.addressActive)
      this.toggleAddressesDialog('close')
    } catch (e) {
      console.log(e)
    }
  }

  unlockWalletWithMetaMask = async _ => {
    const error = await this.props.loginWithMetamask()
    if (error) {this.setState({error})}
  }

  render() {

    const {
      props: {
        authenticated,
        isSelectAddressModalOpen,
        loginWithTrezorWallet,
      },
      state: { 
        selectedTabId, 
        privateKeyStatus, 
        privateKey,
        mnemonicStatus,
        mnemonic,
        password,
        passwordStatus,
        addressActive,
        addresses,
        isOpenAddressesDialog,
        isOpenSelectHdPathModal,
        indexHdPathActive,
        ledgerError,
        loading,
        error,
      },
      handleTabChange,
      handlePrivateKeyChange,
      unlockWalletWithPrivateKey,
      unlockWalletWithPrivateKeyOnKeyPress,
      handleMnemonicChange,
      unlockWalletWithMnemonic,
      handlePasswordChange,
      toggleAddressesDialog,
      toggleSelectHdPathModal,
      handleHdPathChange,
      connectToLedger,
      prevAddresses,
      nextAddresses,
      openAddressesTrezorDialog,
      closeAddressesTrezorDialog,
      deviceService,
      chooseAddress,
      unlockWalletWithLedger,
      unlockWalletWithMetaMask,
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
          unlockWalletWithPrivateKeyOnKeyPress={unlockWalletWithPrivateKeyOnKeyPress}
          mnemonicStatus={mnemonicStatus}
          mnemonic={mnemonic}
          handleMnemonicChange={handleMnemonicChange}
          unlockWalletWithMnemonic={unlockWalletWithMnemonic}
          password={password}
          passwordStatus={passwordStatus}
          handlePasswordChange={handlePasswordChange}
          addressActive={addressActive}
          addresses={addresses}
          isOpenAddressesDialog={isOpenAddressesDialog}
          toggleAddressesDialog={toggleAddressesDialog}
          toggleSelectHdPathModal={toggleSelectHdPathModal}
          handleHdPathChange={handleHdPathChange}
          indexHdPathActive={indexHdPathActive}
          hdPaths={hdPaths}
          connectToLedger={connectToLedger}
          prevAddresses={prevAddresses}
          nextAddresses={nextAddresses}
          ledgerError={ledgerError}
          errorList={errorList}
          isOpenSelectHdPathModal={isOpenSelectHdPathModal}
          isSelectAddressModalOpen={isSelectAddressModalOpen}
          openAddressesTrezorDialog={openAddressesTrezorDialog}
          closeAddressesTrezorDialog={closeAddressesTrezorDialog}
          deviceService={deviceService}
          loginWithTrezorWallet={loginWithTrezorWallet}
          loading={loading}
          chooseAddress={chooseAddress}
          unlockWalletWithLedger={unlockWalletWithLedger}
          unlockWalletWithMetaMask={unlockWalletWithMetaMask}
          error={error} />
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  height: 100%;
`

export default LoginPage
