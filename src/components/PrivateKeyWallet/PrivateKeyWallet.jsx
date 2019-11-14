import React from 'react'

import { validatePassword } from '../../utils/helpers'
import { createWalletFromPrivateKey } from '../../store/services/wallet'
import PrivateKeyWalletRenderer from './PrivateKeyWalletRenderer'

type State = {
    privateKeyStatus: string,
    privateKey: string,
    password: string,
    passwordStatus: string,
    loading: Boolean,
}

class PrivateKeyWallet extends React.PureComponent {

    state: State = {
        privateKeyStatus: 'initial',
        privateKey: '',
        password: '',
        passwordStatus: 'initial',
        loading: false,
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

    unlockWallet = async () => {
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
    
    unlockWalletByKeyPress = async (event) => {
        if (event.key !== 'Enter') return
    
        await this.unlockWalletWithPrivateKey()
    }

    render() {
        const {
            state: { 
                privateKeyStatus, 
                privateKey,
                password,
                passwordStatus,
            },
            handlePrivateKeyChange,
            unlockWallet,
            unlockWalletByKeyPress,
            handlePasswordChange,
        } = this

        return(
            <PrivateKeyWalletRenderer
                privateKey={privateKey} 
                privateKeyStatus={privateKeyStatus} 
                handlePrivateKeyChange={handlePrivateKeyChange}
                unlockWallet={unlockWallet}
                unlockWalletByKeyPress={unlockWalletByKeyPress}
                password={password}
                passwordStatus={passwordStatus}
                handlePasswordChange={handlePasswordChange} />
        )
    }
}

export default PrivateKeyWallet
