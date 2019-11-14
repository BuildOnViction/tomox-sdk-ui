// @flow
import React from 'react'
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import { utils } from 'ethers'
import BigNumber from 'bignumber.js'
import { FormattedMessage } from 'react-intl'

import LoginPageRenderer from './LoginPageRenderer'
import { LedgerWallet } from '../../store/services/signer/ledger'
import AddressGenerator from '../../store/services/device/addressGenerator'

type Props = {
  authenticated: boolean,
  loginWithLedgerWallet: () => void,
  removeNotification: any => void,
}

type State = {
  selectedTabId: string,
  isOpenAddressesDialog: boolean,
  addresses: Array<Object>,
  indexAddress: number,
  ledgerError: object,
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
      mnemonicStatus: 'initial',
      mnemonic: '',
      password: '',
      passwordStatus: 'initial',
    })
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

  render() {

    const {
      props: {
        authenticated,
        isSelectAddressModalOpen,
      },
      state: { 
        selectedTabId, 
        addressActive,
        addresses,
        isOpenAddressesDialog,
        isOpenSelectHdPathModal,
        indexHdPathActive,
        ledgerError,
        loading,
      },
      handleTabChange,
      toggleAddressesDialog,
      toggleSelectHdPathModal,
      handleHdPathChange,
      connectToLedger,
      prevAddresses,
      nextAddresses,
      chooseAddress,
      unlockWalletWithLedger,
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
          loading={loading}
          chooseAddress={chooseAddress}
          unlockWalletWithLedger={unlockWalletWithLedger} />
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  height: 100%;
`

export default LoginPage
