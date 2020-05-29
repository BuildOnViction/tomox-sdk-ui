import React from 'react'

import { createWalletFromPrivateKey } from '../../store/services/wallet'
import PrivateKeyWalletRenderer from './PrivateKeyWalletRenderer'

type State = {
    privateKeyStatus: string,
    privateKey: string,
    password: string,
    passwordStatus: string,
}

class PrivateKeyWallet extends React.PureComponent {

    state: State = {
        privateKeyStatus: 'initial',
        privateKey: '',
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

    unlockWallet = async () => {
        const { 
            props: { loginWithWallet },
            state: { privateKey, privateKeyStatus },
        } = this
    
        if (privateKeyStatus !== 'valid') return
    
        const privateKeyString = (privateKey.length === 64) ? `0x${privateKey}` : privateKey
        const { wallet } = await createWalletFromPrivateKey(privateKeyString)
    
        if (!wallet) {
            this.setState({ privateKeyStatus: 'invalid' })
            return
        }
    
        loginWithWallet(wallet)
    }
    
    unlockWalletByKeyPress = async (event) => {
        if (event.key !== 'Enter') return
    
        await this.unlockWallet()
    }

    render() {
        const {
            state: { 
                privateKeyStatus, 
                privateKey,
            },
            props: {
                loading,
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
                handlePasswordChange={handlePasswordChange}
                loading={loading} />
        )
    }
}

export default PrivateKeyWallet
