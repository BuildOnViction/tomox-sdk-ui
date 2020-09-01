import WalletConnect from "@walletconnect/client"
import QRCodeModal from "@walletconnect/qrcode-modal"
import { Signer, providers, utils } from 'ethers'

import { TOMOCHAIN_NODE_HTTP_URL, DEFAULT_NETWORK_ID } from '../../../config/environment'
import { addMethodsToSigner } from './index'
import { getTxHash } from "../../../utils/crypto"

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
            chainId: +DEFAULT_NETWORK_ID,
        })

        connector.chainId = +DEFAULT_NETWORK_ID
        connector.rpcUrl = TOMOCHAIN_NODE_HTTP_URL
        console.log(connector, connector.chainId, 'connector==============================================')

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
    
        // const tx = new EthereumTx(transaction)
        // const serializedTx = tx.serialize().toString('hex')
        // const msgParams = [
        //     serializedTx,
        //     this.address,
        // ]

        // const sign = await this.connector.signPersonalMessage(msgParams)
        // let { r, s, v } = utils.splitSignature(sign)
        // v = utils.hexlify(v)

        // const txAndSign = new EthereumTx({...transaction, r, s, v})
        // const serializedTxAndSign = '0x' + txAndSign.serialize().toString('hex')

        // return serializedTxAndSign
        // const txHash = getTxHash(transaction)
        // const msgParams = [
        //     txHash,
        //     this.address,
        // ]
        this.connector.chainId = +DEFAULT_NETWORK_ID
        console.log(this.connector, this.connector.chainId, 'connector==============================================')

        // const result = await this.connector.signPersonalMessage(msgParams)
        const result = await this.connector.signTransaction(transaction)
        return result
        let {r, s, v} = utils.splitSignature(result)
        const signature = {r, s, v}
        
        const txSerialized = await utils.serializeTransaction(transaction, signature)
        console.log(utils.parseTransaction(txSerialized), 'serialized ========================')
        return txSerialized
    }

    sendTransaction = async (transaction) => {
        transaction.data = '0x'
        transaction.from = this.address

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

