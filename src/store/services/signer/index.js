// @flow
import { providers, Wallet, utils } from 'ethers'
import { signOrder, signTrade, getFeedRequest, updateSwarmFeed, createRawOrder, createOrderCancel } from './methods'
import { NETWORK_URL } from '../../../config/url'

import type { UpdateSignerParams, Signer } from '../../../types/signer'
import type { Provider } from '../../../types/network';

// for testing with local
window.utils = utils

export const createSigner = async (params: UpdateSignerParams): any => {
  try {
    let { type, custom, url, networkId, wallet } = params
    let settings, address
    if (!custom) {
      switch (type) {
        case 'metamask':
          if (typeof window.web3 === 'undefined') throw new Error('Metamask not installed')
          if (typeof window.web3.eth.defaultAccount === 'undefined') throw new Error('Metamask account locked')
          address = await createMetamaskSigner()
          settings = { type: 'metamask', networkId }
          return { settings, address }
        case 'rpc':
          settings = { type: 'rpc', url: NETWORK_URL, networkId: 8888 }
          address = await createRpcSigner(settings.url, settings.networkId)
          return { settings, address }
        case 'wallet':
          if (!wallet) throw new Error('Wallet not found')
          networkId = networkId || 8888
          settings = { type: 'wallet', url: NETWORK_URL, networkId: 8888 }
          address = await createLocalWalletSigner(wallet, networkId)
          return { settings, address }
        default:
          throw new Error('Incorrect type')
      }
    } else {
      switch (type) {
        case 'metamask':
          if (typeof window.web3 === 'undefined') throw new Error('Metamask not installed')
          if (typeof window.web3.eth.defaultAccount === 'undefined') throw new Error('Metamask account locked')
          settings = { type }
          address = await createMetamaskSigner()
          return { settings, address }

        case 'rpc':
          settings = { type, url, networkId }
          address = await createRpcSigner(url, networkId)
          return { settings, address }

        case 'wallet':
          if (!wallet) throw new Error('Wallet not found')
          networkId = networkId || 8888
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
const addMethodsToSigner = signer => {
  signer.signOrder = signOrder
  signer.signTrade = signTrade
  // the first param by default is this signer
  signer.createRawOrder = createRawOrder
  signer.createOrderCancel = createOrderCancel

  // if local wallet then support swarm feed extensions
  if (signer.signingKey) {
    signer.getFeedRequest = getFeedRequest
    signer.updateSwarmFeed = updateSwarmFeed
  }
}

export const createMetamaskSigner = async () => {
  let networkId = Number(window.web3.version.network)
  let provider = new providers.Web3Provider(window.web3.currentProvider, { chainId: networkId })
  let signer = provider.getSigner()
  addMethodsToSigner(signer)

  let address = await signer.getAddress()
  window.signer = { instance: signer, type: 'metamask' }

  return { address, networkId }
}

Wallet.prototype.signDigest = function(hash) {
  return this.signingKey.signDigest(hash)
}

export const createLocalWalletSigner = async (wallet: Object, networkId: ?number) => {
  networkId = networkId || 8888
  let provider = new providers.JsonRpcProvider(NETWORK_URL, { chainId: networkId, name: undefined })
  let signer = new Wallet(wallet.privateKey, provider)

  addMethodsToSigner(signer)  
  window.signer = { instance: signer, type: 'wallet' }

  return wallet.address
}

export const createInfuraRinkebyWalletSigner = async (wallet: Object) => {
  let provider = new providers.InfuraProvider('rinkeby')
  let signer = new Wallet(wallet.key, provider)
  addMethodsToSigner(signer)

  window.signer = { instance: signer, type: 'wallet' }

  return wallet.address
}

export const createInfuraWalletSigner = async (wallet: Object) => {
  let provider = new providers.InfuraProvider('homestead')
  let signer = new Wallet(wallet.key, provider)
  addMethodsToSigner(signer)

  window.signer = { instance: signer, type: 'wallet' }

  return wallet.address
}

export const createRpcSigner = async (url: ?string, networkId: ?number) => {
  let provider = new providers.JsonRpcProvider(url, { chainId: networkId, name: 'unspecified' })
  let accountAddresses = await provider.listAccounts()
  let signer = provider.getSigner(accountAddresses[0])
  addMethodsToSigner(signer)

  window.signer = { instance: signer, type: 'local' }
  return accountAddresses[0]
}

export const getSigner = ():Signer => window.signer.instance
export const getProvider = ():Provider => window.signer.instance.provider
