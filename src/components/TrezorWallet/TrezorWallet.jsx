import React from 'react'
import TrezorWalletRenderer from './TrezorWalletRenderer'

import { TrezorSigner } from '../../store/services/signer/trezor'
import AddressGenerator from '../../store/services/device/addressGenerator'
import SelectHdPathModal from '../../components/SelectHdPathModal'
import SelectAddressModal from '../../components/SelectAddressModal'

const HDPATHS = [
    {path: "m/44'/60'/0'", type: "Ledger Live"},
    {path: "m/44'/60'/0'/0", type: "Ethereum App"},
].map((m, index) => ({ ...m, rank: index + 1 }))

class TrezorWallet extends React.PureComponent {
    deviceService = null
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
    
    connectToTrezor = async () => {    
        try {
            this.setState({ loading: true })
            new TrezorSigner(HDPATHS[this.state.indexHdPathActive].path)
            const publicKey = await window.signer.instance.getPublicKey(HDPATHS[this.state.indexHdPathActive].path)
            this.addressGenerator = new AddressGenerator(publicKey)            
            const addresses = await this.addressGenerator.getAddresses(this.state.offset, this.state.limit)
            
            if (addresses.length > 0) {
                this.setState({ 
                    addresses,
                    loading: false,
                })
        
                this.toggleAddressesDialog('open')
                this.toggleSelectHdPathModal('close')
            }
        } catch(e) {
            console.log(e)
            this.setState({ 
                addresses: [],
                loading: false,
            })
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

    chooseAddress = (address) => {
        this.setState({ addressActive: address })
    }

    unlockWalletWithTrezor = async () => {
        try {
            await this.props.loginWithTrezorWallet(this.state.addressActive.addressString)
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

            },
            toggleSelectHdPathModal,
            handleHdPathChange,
            connectToTrezor,
            toggleAddressesDialog,
            prevAddresses,
            nextAddresses,
            chooseAddress,
            unlockWalletWithTrezor,
        } = this

        return (
            <React.Fragment>
                <TrezorWalletRenderer 
                    toggleSelectHdPathModal={toggleSelectHdPathModal}
                    handleHdPathChange={handleHdPathChange}
                    isOpenSelectHdPathModal={isOpenSelectHdPathModal}
                    connectToTrezor={connectToTrezor}
                    indexHdPathActive={indexHdPathActive}
                    hdPaths={HDPATHS}
                    isOpenAddressesDialog={isOpenAddressesDialog} />

                <SelectHdPathModal
                    isOpen={isOpenSelectHdPathModal}
                    onClose={toggleSelectHdPathModal}
                    connect={connectToTrezor}
                    onHdPathChange={handleHdPathChange}
                    hdPaths={HDPATHS}
                    indexActive={indexHdPathActive}
                    loading={loading}
                    subTitleId="unlockWalletPage.chooseHdPathModalTrezor.subTitle" />

                <SelectAddressModal 
                    addressActive={addressActive}
                    addresses={addresses}
                    isOpenAddressesDialog={isOpenAddressesDialog}
                    onClose={toggleAddressesDialog}
                    unlockWallet={unlockWalletWithTrezor}
                    prevAddresses={prevAddresses}
                    nextAddresses={nextAddresses}
                    chooseAddress={chooseAddress} />
            </React.Fragment>
        )
    }    
}

export default TrezorWallet