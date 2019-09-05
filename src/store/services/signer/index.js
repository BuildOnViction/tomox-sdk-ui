// @flow
import { Wallet, utils } from 'ethers'
import {
  signOrder,
  signTrade,
  createRawOrder,
  createOrderCancel,
} from './methods'
import { createProvider } from '../../../utils/provider'
import {
  DEFAULT_NETWORK_ID,
  TOMOCHAIN_NODE_HTTP_URL,
} from '../../../config/environment'
import type {
  UpdateSignerParams,
  Signer,
  Provider,
} from '../../../types/signer'
// import type { ProviderType } from '../../../types/common';

// for testing with local
window.utils = utils

export const createSigner = async (params: UpdateSignerParams): any => {
  try {
    const { type, custom, url, networkId = DEFAULT_NETWORK_ID, wallet } = params
    let settings, address
    if (!custom) {
      switch (type) {
        case 'metamask':
          if (typeof window.web3 === 'undefined')
            throw new Error('Metamask not installed')
          if (typeof window.web3.eth.defaultAccount === 'undefined')
            throw new Error('Metamask account locked')
          address = await createMetamaskSigner()
          settings = { type: 'metamask', networkId }
          return { settings, address }
        case 'rpc':
          settings = { type: 'rpc', url: TOMOCHAIN_NODE_HTTP_URL, networkId }
          address = await createRpcSigner(settings.url, settings.networkId)
          return { settings, address }
        case 'wallet':
          if (!wallet) throw new Error('Wallet not found')
          settings = { type: 'wallet', url: TOMOCHAIN_NODE_HTTP_URL, networkId }
          address = await createLocalWalletSigner(wallet, networkId)
          return { settings, address }
        default:
          throw new Error('Incorrect type')
      }
    } else {
      switch (type) {
        case 'metamask':
          if (typeof window.web3 === 'undefined')
            throw new Error('Metamask not installed')
          if (typeof window.web3.eth.defaultAccount === 'undefined')
            throw new Error('Metamask account locked')
          settings = { type }
          address = await createMetamaskSigner()
          return { settings, address }

        case 'rpc':
          settings = { type, url, networkId }
          address = await createRpcSigner(url, networkId)
          return { settings, address }

        case 'wallet':
          if (!wallet) throw new Error('Wallet not found')
          settings = { type, url, networkId }
          address = await createLocalWalletSigner(wallet, networkId)
          return { settings, address }
        default:
          throw new Error('Incorrect type')
      }
    }
  } catch (e) {
    console.log(e)
    throw new Error(e.message)
  }
}

// this method add extension methods to the current signer
export const addMethodsToSigner = (signer: Signer) => {
  signer.signOrder = signOrder
  signer.signTrade = signTrade
  // the first param by default is this signer
  signer.createRawOrder = createRawOrder
  signer.createOrderCancel = createOrderCancel
}

export const createMetamaskSigner = async () => {
  const networkId = Number(window.web3.version.network)
  const provider = createProvider('web3', networkId)
  const signer = provider.getSigner()
  addMethodsToSigner(signer)

  const address = await signer.getAddress()
  window.signer = { instance: signer, type: 'metamask' }

  return { address, networkId }
}

Wallet.prototype.signDigest = function(hash) {
  return this.signingKey.signDigest(hash)
}

export const createLocalWalletSigner = async (
  wallet: Object,
  networkId: ?number = DEFAULT_NETWORK_ID
) => {
  const provider = createProvider('local')
  const signer = new Wallet(wallet.privateKey, provider)

  addMethodsToSigner(signer)
  window.signer = { instance: signer, type: 'wallet' }

  return wallet.address
}

export const createInfuraRinkebyWalletSigner = async (wallet: Object) => {
  const provider = createProvider('rinkeby')
  const signer = new Wallet(wallet.key, provider)
  addMethodsToSigner(signer)

  window.signer = { instance: signer, type: 'wallet' }

  return wallet.address
}

export const createInfuraWalletSigner = async (wallet: Object) => {
  const provider = createProvider('homestead')
  const signer = new Wallet(wallet.key, provider)
  addMethodsToSigner(signer)

  window.signer = { instance: signer, type: 'wallet' }

  return wallet.address
}

export const createRpcSigner = async (url: ?string, networkId: ?number) => {
  const provider = createProvider('rpc', networkId, url)
  const accountAddresses = await provider.listAccounts()
  const signer = provider.getSigner(accountAddresses[0])
  addMethodsToSigner(signer)

  window.signer = { instance: signer, type: 'local' }
  return accountAddresses[0]
}

export const getSigner = (): Signer => window.signer && window.signer.instance
export const getProvider = (): Provider => window.signer.instance.provider
