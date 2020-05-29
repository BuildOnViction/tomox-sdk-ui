import React from 'react'

import { createWalletFromMnemonic } from '../../store/services/wallet'
import MnemonicWalletRenderer from './MnemonicWalletRenderer'

type State = {
    mnemonicStatus: String,
    mnemonic: String,
    password: String,
    passwordStatus: String,
}

class MnemonicWallet extends React.PureComponent {

    state: State = {
        mnemonicStatus: 'initial',
        mnemonic: '',
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
    
    unlockWalletWithMnemonic = async () => {
        const {
            props: { loginWithWallet },
            state: { mnemonicStatus, mnemonic},
        } = this
    
        if (mnemonicStatus !== 'valid') return
    
        const { wallet } = await createWalletFromMnemonic(mnemonic)
    
        if (!wallet) {
            this.setState({ mnemonicStatus: 'invalid' })
            return
        }
    
        loginWithWallet(wallet)
    }

    render() {
        const {
            state: { 
                mnemonic,
                mnemonicStatus,
            },
            props: {
                loading,
            },
            unlockWalletWithMnemonic,
            handleMnemonicChange,
            handlePasswordChange,
        } = this

        return (
            <MnemonicWalletRenderer
                mnemonic={mnemonic} 
                mnemonicStatus={mnemonicStatus} 
                handleMnemonicChange={handleMnemonicChange} 
                unlockWallet={unlockWalletWithMnemonic}
                handlePasswordChange={handlePasswordChange}
                loading={loading} />
        )
    }    
}

export default MnemonicWallet