import React from 'react'
import { FormattedMessage } from 'react-intl'

import { getSigner } from '../../store/services/signer'
import { LedgerSigner } from '../../store/services/signer/ledger'
import AddressGenerator from '../../store/services/device/addressGenerator'
import SelectHdPathModal from '../../components/SelectHdPathModal'
import SelectAddressModal from '../../components/SelectAddressModal'
import LedgerWalletRenderer from './LedgerWalletRenderer'

const ERRORS = {
    "TransportOpenUserCancelled": <FormattedMessage id="unlockWalletPage.ledger.errorNoDevice" />,
    "26368": <FormattedMessage id="unlockWalletPage.ledger.error26368" />,
    "26628": <FormattedMessage id="unlockWalletPage.ledger.error26628" />,
}
  
const HDPATHS = [
    {path: "m/44'/889'/0'/0", type: "TomoChain App"},
    {path: "m/44'/60'/0'", type: "Ledger Live"},
    {path: "m/44'/60'/0'/0", type: "Ethereum App"},
].map((m, index) => ({ ...m, rank: index + 1 }))

class LedgerWallet extends React.PureComponent {
    addressGenerator = null

    state = {
        isOpenAddressesDialog: false,
        isOpenSelectHdPathModal: false,
        addressActive: null,
        addresses: [],
        indexHdPathActive: 0,
        loading: false,
        offset: 0,
        limit: 5,
    }

    createLedgerSigner = async () => {
        try {
          const { path } = HDPATHS[this.state.indexHdPathActive]
          new LedgerSigner(path)
          await getSigner().create()
        } catch(e) {
          throw e
        }
    }
    
    prevAddresses = async _ => {
        let offset = this.state.offset - this.state.limit
        offset = (offset > 0) ? offset : 0
        const addresses = await this.addressGenerator.getAddresses(offset, this.state.limit)
        this.setState({ addresses, offset })
    }
    
    nextAddresses = async _ => {
        const offset = this.state.offset + this.state.limit
        const addresses = await this.addressGenerator.getAddresses(offset, this.state.limit)
        this.setState({ addresses, offset })
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
            const publicKey = await getSigner().getPublicKey()
            this.addressGenerator = new AddressGenerator(publicKey)            
            const addresses = await this.addressGenerator.getAddresses(this.state.offset, this.state.limit)
            
            if (addresses.length > 0) {
                this.setState({ 
                    addresses,
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
            state: { 
                indexHdPathActive,
                isOpenSelectHdPathModal,
                isOpenAddressesDialog,
                loading,
                addressActive,
                addresses,
                ledgerError,
            },
            toggleSelectHdPathModal,
            handleHdPathChange,
            connectToLedger,
            toggleAddressesDialog,
            prevAddresses,
            nextAddresses,
            chooseAddress,
            unlockWalletWithLedger,
        } = this

        return (
            <React.Fragment>
                <LedgerWalletRenderer 
                    toggleSelectHdPathModal={toggleSelectHdPathModal}
                    handleHdPathChange={handleHdPathChange}
                    isOpenSelectHdPathModal={isOpenSelectHdPathModal}
                    connectToLedger={connectToLedger}
                    indexHdPathActive={indexHdPathActive}
                    hdPaths={HDPATHS}
                    isOpenAddressesDialog={isOpenAddressesDialog} />

                <SelectHdPathModal
                    subTitleId="unlockWalletPage.chooseHdPathModal.subTitle"
                    instructionId="unlockWalletPage.chooseHdPathModal.instruction"
                    isOpen={isOpenSelectHdPathModal}
                    onClose={toggleSelectHdPathModal}
                    connect={connectToLedger}
                    onHdPathChange={handleHdPathChange}
                    hdPaths={HDPATHS}
                    indexActive={indexHdPathActive}
                    error={ledgerError}
                    errorList={ERRORS}
                    loading={loading} />

                <SelectAddressModal 
                    addressActive={addressActive}
                    addresses={addresses}
                    isOpenAddressesDialog={isOpenAddressesDialog}
                    onClose={toggleAddressesDialog}
                    unlockWallet={unlockWalletWithLedger}
                    prevAddresses={prevAddresses}
                    nextAddresses={nextAddresses}
                    ledgerError={ledgerError}
                    errorList={ERRORS}
                    chooseAddress={chooseAddress} />
            </React.Fragment>
        )
    }
}

export default LedgerWallet