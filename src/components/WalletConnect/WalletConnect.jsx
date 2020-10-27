import React from 'react'

import { getSigner } from '../../store/services/signer'
import { WalletConnectSigner } from '../../store/services/signer/walletConnect'
import WalletConnectRenderer from './WalletConnectRenderer'

function WalletConnect({ loginWithWalletConnect, logout, loading }) {
    async function unlockWallet() {
        localStorage.removeItem('walletconnect')

        new WalletConnectSigner()
        const signer = getSigner()
        await signer.walletConnectInit()

        // check if already connected
        if (!signer.connector.connected) {
            // create new session
            await signer.connector.createSession()
        }
  
        // Subscribe to connection events
        signer.connector.on("connect", (error, payload) => {
            if (error) {
                throw error
            }
          
            // Get provided accounts and chainId
            const { accounts } = payload.params[0]
            // console.log(accounts, chainId, '===============================')

            signer.setAddress(accounts[0])
            loginWithWalletConnect(accounts[0])
        })

        signer.connector.on("session_update", (error, payload) => {
            if (error) {
              throw error
            }
          
            // Get updated accounts and chainId
            // const { accounts, chainId } = payload.params[0]
            // console.log(accounts, chainId, '==================================')
            
        })

        signer.connector.on("disconnect", (error, payload) => {
            if (error) {
              throw error
            }
          
            // Delete connector
            console.log('disconnect========================================')
            logout()            
        })
    }

    return <WalletConnectRenderer 
                unlockWallet={unlockWallet}
                loading={loading}
            />
}

export default WalletConnect