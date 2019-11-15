import { Signer, providers, utils } from 'ethers'
import Eth from '@ledgerhq/hw-app-eth'
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import webUsbTransport from '@ledgerhq/hw-transport-webusb'
import platform from 'platform'

import { TOMOCHAIN_NODE_HTTP_URL, DEFAULT_NETWORK_ID } from '../../../config/environment'
import { addMethodsToSigner } from './index'

const EthereumTx = require('ethereumjs-tx')
// const defaultDPath = "m/44'/889'/0'/0"
const defaultDPath = "m/44'/60'/0'"
const OPEN_TIMEOUT = 10000
const LISTENER_TIMEOUT = 15000

export class LedgerSigner extends Signer {

    constructor(path = defaultDPath) {
        super()
        this.path = path
        this.networkId = DEFAULT_NETWORK_ID === 'default' ? DEFAULT_NETWORK_ID : parseInt(DEFAULT_NETWORK_ID, 10)
        
        this.provider = new providers.JsonRpcProvider(TOMOCHAIN_NODE_HTTP_URL, {
          chainId: this.networkId,
        })

        window.signer = { instance: this, type: 'hardwareWallet' }
        addMethodsToSigner(this)
    }

    isWebUsbSupported = async () => {
        const isSupported = await webUsbTransport.isSupported()
        return isSupported && platform.os.family !== 'Windows'
    }

    getLedgerTransport = async () => {
        let transport
        const support = await this.isWebUsbSupported()

        if (support) {
          transport = await webUsbTransport.create()
        } else {
          transport = await TransportU2F.create(OPEN_TIMEOUT, LISTENER_TIMEOUT)
        }
        return transport
    }

    create = async () => {
        try {
            const transport = await this.getLedgerTransport()
            this.eth = new Eth(transport)
        } catch(e) {
            throw e
        }
    }

    getPublicKey = async _ => {
        if (this.eth) {
            // Result of getAddress function includes address, publickKey, chainCode
            const result = await this.eth.getAddress(this.path, false, true)

            return result
        }

        return null
    }

    setAddress = (address) => {
        this.address = address
    }

    getAddress = () => {
        return this.address.addressString
    }

    signMessage = async (message) => {
        const result = await this.eth.signPersonalMessage(
            `${this.path}/${this.address.index}`,
            Buffer.from(message).toString("hex")
        )
        
        let v = result['v'] - 27
        v = v.toString(16)

        if (v.length < 2) {
            v = "0" + v
        }

        console.log("Signature 0x" + result['r'] + result['s'] + v)
        return `0x${result['r']}${result['s']}${v}`
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
            await this.provider.getTransactionCount(this.address.addressString)
        )
    
        // Get sign from transaction
        const tx = new EthereumTx(transaction)
        tx.v = Buffer.from([this.networkId])
        const serializedTx = tx.serialize().toString('hex')
        const sign = await this.eth.signTransaction(`${this.path}/${this.address.index}`, serializedTx)

        // Serialize transaction with sign
        Object.keys(sign).forEach((key, _) => {
            if (!sign[key].startsWith('0x')) {
                sign[key] = '0x' + sign[key] 
            }
        })

        const txAndSign = new EthereumTx({...transaction, ...sign})
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

