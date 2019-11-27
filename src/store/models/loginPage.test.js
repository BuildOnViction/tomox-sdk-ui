import createStore from '../../store/configureStore'
import loginPageSelector from './loginPage'
import * as actionCreators from './loginPage'
import * as walletActionCreators from '../actions/createWallet'
import getAccountDomain from '../domains/account'
import getWalletDomain from '../domains/wallets'
import * as walletService from '../services/wallet'
import * as signerService from '../services/signer'

//TODO: write test for new flow (alway save private key to session storage)

jest.mock('../services/wallet')
jest.mock('../services/signer')

let accountDomain, domain

beforeEach(() => {
  jest.resetAllMocks()
})

// const unsubscribe = jest.fn()
let model

describe('Login Page Model', () => {
  walletService.saveEncryptedWalletInLocalStorage = jest.fn()
  walletService.savePrivateKeyInSessionStorage = jest.fn()
  signerService.createMetamaskSigner = jest.fn(() => Promise.resolve('test address'))

  it('handles loginWithMetamask action (web3 undefined)', async () => {
    global.web3 = undefined
    const { store } = createStore()

    model = loginPageSelector(store.getState())
    expect(model.authenticated).toEqual(false)

    await store.dispatch(actionCreators.loginWithMetamask())

    model = loginPageSelector(store.getState())
    expect(model.authenticated).toEqual(false)

    accountDomain = getAccountDomain(store.getState().account)
    expect(accountDomain.address()).toEqual(null)

    model = loginPageSelector(store.getState())
    expect(model.authenticated).toEqual(false)
    expect(model.loading).toEqual(false)
    expect(model.error).toEqual('Metamask not installed')
  })

  it('handles loginWithMetamask action (web3 present but account locked)', async () => {
    const { store } = createStore()
    global.web3 = {
      eth: 'test eth',
    }

    model = loginPageSelector(store.getState())
    expect(model.authenticated).toEqual(false)

    await store.dispatch(actionCreators.loginWithMetamask())

    model = loginPageSelector(store.getState())
    expect(model.authenticated).toEqual(false)

    accountDomain = getAccountDomain(store.getState().account)
    expect(accountDomain.address()).toEqual(null)

    model = loginPageSelector(store.getState())
    expect(model.authenticated).toEqual(false)
    expect(model.loading).toEqual(false)
    expect(model.error).toEqual('Metamask account locked')
  })

  it('handles loginWithMetamask action (metamask unlocked)', async () => {
    global.web3 = {
      eth: {
        defaultAccount: 'c838efcb6512a2ca12027ebcdf9e1fc5e4ff7ee3',
      },
    }
    const { store } = createStore()

    model = loginPageSelector(store.getState())
    expect(model.authenticated).toEqual(false)

    await store.dispatch(actionCreators.loginWithMetamask())

    model = loginPageSelector(store.getState())

    //TODO (1)
    // expect(model.authenticated).toEqual(true);
    expect(model.loading).toEqual(false)
  })

  it('handles loginWithWallet (no storage)', async () => {
    const { store } = createStore()
    const params = {
      wallet: {
        address: 'test address',
      },
      encryptedWallet: 'test encryptedWallet',
      storeWallet: false,
      storePrivateKey: false,
    }

    await store.dispatch(walletActionCreators.createWallet(params.wallet.address, params.encryptedWallet))
    await store.dispatch(actionCreators.loginWithWallet(params))

    expect(walletService.saveEncryptedWalletInLocalStorage).toHaveBeenCalledTimes(0)
    expect(walletService.savePrivateKeyInSessionStorage).toHaveBeenCalledTimes(0)
    domain = getWalletDomain(store.getState().wallets)
    expect(domain.addresses()).toEqual(['test address'])
    expect(domain.byAddress()).toEqual({
      'test address': {
        address: 'test address',
        encryptedWallet: 'test encryptedWallet',
      },
    })
  })
})
