import { Signer, providers, utils } from 'ethers'
import LedgerEth from '@ledgerhq/hw-app-eth'

import {
  TOMOCHAIN_NODE_HTTP_URL,
  DEFAULT_NETWORK_ID,
} from '../../../config/environment'
import { addMethodsToSigner } from './index'

const defaultDPath = "m/44'/60'/0'/0"

export class LedgerSigner extends Signer {
  constructor() {
    super()
    this.ledgerEth = new LedgerEth()
    const networkId = DEFAULT_NETWORK_ID
    this.provider = new providers.JsonRpcProvider(TOMOCHAIN_NODE_HTTP_URL, {
      chainId: networkId,
    })
    window.signer = { instance: this, type: 'hardwareWallet' }
    addMethodsToSigner(this)
  }

  getPublicKey = async (path = defaultDPath) => {
    const result = await this.ledgerEth.getAddress(path)
    if (result.publicKey) {
      return result.publicKey
    }
    console.log(result)
    throw new Error(result)
  }

  getAddress = async (path = defaultDPath) => {
    const result = await this.ledgerEth.getAddress(path)
    if (result.address) {
      return result.address
    }
    console.log(result)
    throw new Error(result)
  }

  // TODO
  signMessage = async message => {
    return 0
  }

  sign = async transaction => {
    try {
      const tx = await utils.resolveProperties(transaction)
      const unsignedTx = utils.serializeTransaction(tx).substring(2)

      const signature = await this.ledgerEth.signTransaction(
        defaultDPath,
        unsignedTx
      )

      const sig = {
        v: signature.v,
        r: '0x' + signature.r,
        s: '0x' + signature.s,
      }

      return utils.serializeTransaction(tx, sig)
    } catch (err) {
      console.log(err)
    }
  }

  sendTransaction = async transaction => {
    const signedTx = await this.sign(transaction)
    return this.provider.sendTransaction(signedTx)
  }
}
