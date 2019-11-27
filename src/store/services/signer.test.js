import { ethers, providers } from 'ethers'

import * as signerService from './signer'
import { TOMOCHAIN_NODE_HTTP_URL, DEFAULT_NETWORK_ID } from '../../config/environment'
import {
  signOrder,
  signTrade,
  createRawOrder,
  createOrderCancel,
} from '../services/signer/methods'

jest.mock('ethers')

describe('createProvider', () => {
  let providerMock
  let listAccounts
  let getBlockNumber
  let getSigner

  beforeEach(() => {
    jest.clearAllMocks()

    getBlockNumber = jest.fn(() => Promise.resolve('test blockNumber'))
    listAccounts = jest.fn(() => Promise.resolve(['test address']))
    getSigner = _ => ({
      createOrderCancel, 
      createRawOrder, 
      signOrder, 
      signTrade,
      getAddress: _=> 'test address',
    })
    providerMock = { getBlockNumber, listAccounts, getSigner }

    ethers.getDefaultProvider.mockReturnValue(providerMock)
    providers.InfuraProvider.mockImplementation(() => providerMock)
    providers.JsonRpcProvider.mockImplementation(() => providerMock)
    providers.Web3Provider.mockImplementation(() => providerMock)
  })

  it('create metamask provider', async () => {
    window.web3 = {
      version: {
        network: '8888',
      },
      currentProvider: 'web3',
      eth: {
        defaultAccount: 'test defaultAccount',
      },
    }

    const params = { type: 'metamask', custom: false }
    const { settings, address } = await signerService.createSigner(params)

    expect(settings).toEqual({ type: 'metamask', networkId: DEFAULT_NETWORK_ID })
    expect(address).toEqual({ address: 'test address', networkId: 8888 })
    expect(providers.Web3Provider).toHaveBeenCalledTimes(1)
    console.log(JSON.parse(JSON.stringify(getSigner())))
    // expect(window.signer.instance).toEqual(getSigner())
    expect(window.signer.type).toEqual('metamask')
  })

  it('creates local provider', async () => {
    const params = { type: 'rpc' }
    const { settings, address } = await signerService.createSigner(params)

    expect(settings).toEqual({ type: 'rpc', url: TOMOCHAIN_NODE_HTTP_URL, networkId: DEFAULT_NETWORK_ID })
    expect(address).toEqual('test address')
    expect(providers.JsonRpcProvider).toHaveBeenCalledTimes(1)
    expect(providers.JsonRpcProvider).toHaveBeenCalledWith(TOMOCHAIN_NODE_HTTP_URL, {
      chainId: DEFAULT_NETWORK_ID,
      name: 'unspecified',
    })

    // expect(window.signer.instance).toEqual(getSigner())
    expect(window.signer.type).toEqual('local')
  })
})
