import React from 'react'

import { validatePassword } from '../../utils/helpers'
import { createWalletFromMnemonic } from '../../store/services/wallet'
import MnemonicWalletRenderer from './MnemonicWalletRenderer'

type State = {
    mnemonicStatus: String,
    mnemonic: String,
    password: String,
    passwordStatus: String,
    loading: Boolean,
}

class MnemonicWallet extends React.PureComponent {

    state: State = {
        mnemonicStatus: 'initial',
        mnemonic: '',
        password: '',
        passwordStatus: 'initial',
        loading: false,
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

    render() {
        const {
            state: { 
                mnemonic,
                mnemonicStatus,
                password,
                passwordStatus,
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
                password={password}
                passwordStatus={passwordStatus}
                handlePasswordChange={handlePasswordChange} />
        )
    }    
}

export default MnemonicWallet