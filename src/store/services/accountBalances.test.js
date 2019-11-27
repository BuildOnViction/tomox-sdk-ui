import { Contract, utils } from 'ethers'
import * as signerService from './signer'
import * as accountBalancesService from './accountBalances'

describe('queryTomoBalance', () => {
  let getBalance
  let address

  beforeEach(() => {
    getBalance = jest.fn().mockReturnValue('test getBalance')
    utils.formatEther.mockReturnValue(1000)
    address = '0x4dc5790733b997f3db7fc49118ab013182d6ba9b'
  })

  it.skip('loads the current provider', async () => {
    await accountBalancesService.queryTomoBalance(address)
    expect(signerService.getProvider).toHaveBeenCalledTimes(1)
  })

  it.skip('the provider returns the current ether balance', async () => {
    await accountBalancesService.queryTomoBalance(address)

    expect(getBalance).toHaveBeenCalledTimes(1)
    expect(getBalance).toHaveBeenCalledWith('0x4dc5790733b997f3db7fc49118ab013182d6ba9b')
  })

  it.skip('returns the formatted ether balance', async () => {
    const result = await accountBalancesService.queryTomoBalance(address)

    expect(utils.formatEther).toHaveBeenCalledTimes(1)
    expect(utils.formatEther).toHaveBeenCalledWith('test getBalance')
    expect(result).toEqual({ symbol: 'TOMO', balance: '1000.0000' })
  })
})

describe('queryBalances', () => {
  let balanceOf
  let providerMock, contractMock
  let tokens, address

  beforeEach(() => {
    balanceOf = jest.fn()
    contractMock = jest.fn(() => ({ balanceOf }))
    providerMock = 'test provider'
    signerService.getProvider.mockImplementation(() => providerMock)
    Contract.mockImplementation(contractMock)

    address = '0x4dc5790733b997f3db7fc49118ab013182d6ba9b'
    tokens = [
      { symbol: 'REQ', address: '0x6e9a406696617ec5105f9382d33ba3360fcfabcc' },
      { symbol: 'WETH', address: '0x44809695706c252435531029b1e9d7d0355d475f' },
    ]
  })

  it.skip('loads the current provider', async () => {
    await accountBalancesService.queryTokenBalances(address, tokens)
    expect(signerService.getProvider).toHaveBeenCalledTimes(1)
  })

  it.skip('the provider returns the current ether balance', async () => {
    await accountBalancesService.queryTokenBalances(address, tokens)

    expect(contractMock).toHaveBeenCalledTimes(2)
    expect(contractMock.mock.calls[0][0]).toEqual('0x6e9a406696617ec5105f9382d33ba3360fcfabcc')
    expect(contractMock.mock.calls[0][1]).toEqual('test ERC20Token abi')
    expect(contractMock.mock.calls[0][2]).toEqual(providerMock)

    expect(balanceOf).toHaveBeenCalledTimes(2)
    expect(contractMock.mock.calls[1][0]).toEqual('0x44809695706c252435531029b1e9d7d0355d475f')
    expect(contractMock.mock.calls[1][1]).toEqual('test ERC20Token abi')
    expect(contractMock.mock.calls[1][2]).toEqual(providerMock)
  })

  it.skip('returns the formatted token balances', async () => {
    balanceOf.mockReturnValueOnce(Promise.resolve('test REQ balance'))
    balanceOf.mockReturnValueOnce(Promise.resolve('test WETH balance'))
    utils.formatEther.mockReturnValueOnce(1000)
    utils.formatEther.mockReturnValueOnce(2000)

    const result = await accountBalancesService.queryTokenBalances(address, tokens)

    expect(utils.formatEther).toHaveBeenCalledTimes(2)
    expect(utils.formatEther.mock.calls[0][0]).toEqual('test REQ balance')
    expect(utils.formatEther.mock.calls[1][0]).toEqual('test WETH balance')

    expect(contractMock).toHaveBeenCalledTimes(2)
    expect(contractMock.mock.calls[0][0]).toEqual('0x6e9a406696617ec5105f9382d33ba3360fcfabcc')
    expect(contractMock.mock.calls[0][1]).toEqual('test ERC20Token abi')
    expect(contractMock.mock.calls[0][2]).toEqual(providerMock)

    expect(result).toEqual([{ symbol: 'REQ', balance: 1000 }, { symbol: 'WETH', balance: 2000 }])
  })
})

