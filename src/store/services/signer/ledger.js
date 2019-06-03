import { Signer, providers, utils } from 'ethers'
import Eth from '@ledgerhq/hw-app-eth'
// import ethTx from 'ethereumjs-tx'
import TransportU2F from '@ledgerhq/hw-transport-u2f'
import webUsbTransport from '@ledgerhq/hw-transport-webusb'
import platform from 'platform'

import { TOMOCHAIN_NODE_HTTP_URL, DEFAULT_NETWORK_ID } from '../../../config/environment'
import { addMethodsToSigner } from './index'

const defaultDPath = "m/44'/889'/0'/0"
const OPEN_TIMEOUT = 10000
const LISTENER_TIMEOUT = 15000

export class LedgerWallet extends Signer {

    constructor(path = defaultDPath) {
        super()
        const networkId = DEFAULT_NETWORK_ID === 'default' ? DEFAULT_NETWORK_ID : parseInt(DEFAULT_NETWORK_ID, 10)
        
        this.provider = new providers.JsonRpcProvider(TOMOCHAIN_NODE_HTTP_URL, {
          chainId: networkId,
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
        const transport = await this.getLedgerTransport()
        return new Eth(transport)
    }

    getAddress = async (index) => {
        const hdPath = index ? `${defaultDPath}/${index}` : defaultDPath
        const { address } = await this.eth.getAddress(hdPath)

        return address
    }

    getMultipleAddresses = async (offset, limit) => {
        const addresses = []

        for (let i = offset; i < (offset + limit); i++) {
            const address = await this.getAddress(i)
            addresses.push(address)
        }

        return addresses
    }

    signMessage = async (message) => {
        const result = await this.eth.signPersonalMessage(
            defaultDPath,
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

    // To do: Send, receive token on portfolio page
    signTransaction = async (tx) => {
        
    }

    sendTransaction = async () => {

    }
}

