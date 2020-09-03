import WalletConnect from "@walletconnect/client"
import QRCodeModal from "@walletconnect/qrcode-modal"
import { Signer, providers, utils } from 'ethers'

import { TOMOCHAIN_NODE_HTTP_URL, DEFAULT_NETWORK_ID } from '../../../config/environment'
import { addMethodsToSigner } from './index'

const EthereumTx = require('ethereumjs-tx')

export class WalletConnectSigner extends Signer {

    constructor() {
        super()
        this.networkId = DEFAULT_NETWORK_ID === 'default' ? DEFAULT_NETWORK_ID : parseInt(DEFAULT_NETWORK_ID, 10)
        
        this.provider = new providers.JsonRpcProvider(TOMOCHAIN_NODE_HTTP_URL, {
          chainId: this.networkId,
        })

        window.signer = { instance: this, type: 'walletConnect' }
        addMethodsToSigner(this)
    }

    walletConnectInit = async () => {
        // bridge url
        const bridge = "https://bridge.walletconnect.org"
    
        // create new connector
        const connector = new WalletConnect({ 
            bridge, 
            qrcodeModal: QRCodeModal,
        })

        this.connector = connector
    }

    setAddress = (address) => {
        this.address = address
    }

    getAddress = () => {
        return this.address
    }

    signMessage = async (message) => {
        try {
            const msgParams = [
                message,
                this.address, 
            ]

            const result = await this.connector.signPersonalMessage(msgParams)
            return result
        } catch (error) {
            console.log(error)
        }
        
    }

    signTransaction = async (transaction) => {
        if (transaction.value) {
            transaction.value = utils.hexlify(transaction.value)
        }

        if (transaction.gasPrice) {
            transaction.gasPrice = utils.hexlify(transaction.gasPrice)
        }

        if (transaction.gasLimit) {
            transaction.gasLimit = utils.hexlify(transaction.gasLimit)
        }
    
        transaction.nonce = utils.hexlify(
            await this.provider.getTransactionCount(this.address)
        )
    
        const tx = new EthereumTx(transaction)

        const msgParams = [
            this.address,
            tx.hash(false).toString('hex'),
        ]

        const sign = await this.connector.signMessage(msgParams)
        const { r, s, v } = utils.splitSignature(sign)
        const txAndSign = new EthereumTx({...transaction, r, s, v})
        const serializedTxAndSign = '0x' + txAndSign.serialize().toString('hex')

        return serializedTxAndSign
    }

    sendTransaction = async (transaction) => {

        if (Promise.resolve(transaction.to) === transaction.to) {
            transaction.to = await transaction.to
        }
    
        if (!transaction.value) {
            transaction.value = utils.parseEther('0.0')
        }
    
        const txSigned = await this.signTransaction(transaction)       
        return this.provider.sendTransaction(txSigned)
    }
}

