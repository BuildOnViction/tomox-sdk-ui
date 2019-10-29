// @flow
import aes from 'crypto-js/aes'
import * as actionCreators from '../actions/loginPage'
import * as notifierActionCreators from '../actions/app'
import { getAccountDomain, getLoginPageDomain } from '../domains'
import {
  getSigner,
  createLocalWalletSigner,
  createMetamaskSigner,
} from '../services/signer'

import type
 { State, ThunkAction } from '../../types'

import { fetchAccountInfo, createAccount } from '../services/api/engine'

export default function loginPageSelector(state: State) {
  return {
    authenticated: getAccountDomain(state).authenticated(),
    loading: getLoginPageDomain(state).isLoading(),
    error: getLoginPageDomain(state).getError(),
    isSelectAddressModalOpen: getLoginPageDomain(state).isSelectAddressModalOpen(),
    getPublicKeyData: () => getLoginPageDomain(state).getPublicKeyData(),
  }
}

export function loginWithMetamask(): ThunkAction {
  return async (dispatch, getState) => {
    try {
      dispatch(actionCreators.requestLogin())
      if (typeof window.web3 === 'undefined')
        throw new Error('Metamask not installed')
      if (typeof window.web3.eth.defaultAccount === 'undefined')
        throw new Error('Metamask account locked')
      const { address } = await createMetamaskSigner()

      // Check account exist on backend yet? 
      // Create account if not yet for get balance of account from backend
      // Remove when connect direct to TomoX
      const accountInfo = await fetchAccountInfo(address)
      if (!accountInfo) { await createAccount(address) }

      dispatch(actionCreators.loginWithMetamask(address))
    } catch (e) {
      if (e.message === 'Metamask account locked')
        return dispatch(actionCreators.loginError('Metamask account locked'))
      if (e.message === 'Metamask not installed')
        return dispatch(actionCreators.loginError('Metamask not installed'))
      if (process.env.NODE_ENV !== 'test') console.log(e)

      dispatch(
        notifierActionCreators.addNotification({ message: 'Login error ' })
      )
      dispatch(actionCreators.loginError(e.message))
    }
  }
}

export function loginWithWallet(wallet, password): ThunkAction {
  return async dispatch => {
    try {
      dispatch(actionCreators.requestLogin())
      const { address, privateKey } = wallet

      const privateKeyEncrypted = aes.encrypt(privateKey, password).toString()      
      await createLocalWalletSigner(wallet)

      // Check account exist on backend yet? 
      // Create account if not yet for get balance of account from backend
      // Remove when connect direct to TomoX
      const accountInfo = await fetchAccountInfo(address)
      if (!accountInfo) { await createAccount(address) }

      dispatch(actionCreators.createWallet(wallet.address))
      dispatch(actionCreators.loginWithWallet(address, privateKeyEncrypted))
    } catch (e) {
      console.log(e)
      dispatch(
        notifierActionCreators.addNotification({ message: 'Login Error' })
      )
      dispatch(actionCreators.loginError(e.message))
    }
  }
}

export function getTrezorPublicKey(deviceService: any, path: string): ThunkAction {
  return async (dispatch, getState) => {
    try {
      dispatch(actionCreators.requestLogin())
      const result = await deviceService.getPublicKey(path)

      dispatch(actionCreators.getPublicKey(result))
      dispatch(actionCreators.toggleSelectAddressModal(true))
    } catch (e) {
      dispatch(
        notifierActionCreators.addNotification({ message: 'Login error' })
      )
      dispatch(actionCreators.loginError(e.message))
    }
  }
}

export function closeSelectAddressModal(): ThunkAction {
  return async (dispatch, getState) => {
    try {
      dispatch(actionCreators.toggleSelectAddressModal(false))
    } catch (e) {
      dispatch(
        notifierActionCreators.addNotification({ message: 'Login error' })
      )
      dispatch(actionCreators.loginError(e.message))
    }
  }
}

export function getBalance(address: string): ThunkAction {
  return async (dispatch, getState) => {
    try {
      const balance = await getSigner().provider.getBalance(address)
      return balance
    } catch (e) {
      return 0
    }
  }
}

export function loginWithTrezorWallet(data: Object): ThunkAction {
  return async (dispatch, getState) => {
    try {
      // Check account exist on backend yet? 
      // Create account if not yet for get balance of account from backend
      // Remove when connect direct to TomoX
      const accountInfo = await fetchAccountInfo(data.address)
      if (!accountInfo) { await createAccount(data.address) }

      dispatch(actionCreators.toggleSelectAddressModal(false))
      dispatch(actionCreators.requestLogin())
      dispatch(actionCreators.loginWithTrezorWallet(data.address))
    } catch (e) {
      dispatch(
        notifierActionCreators.addNotification({ message: 'Login error' })
      )
      dispatch(actionCreators.loginError(e.message))
    }
  }
}

export function loginWithLedgerWallet(address): ThunkAction {
  return async (dispatch, getState) => {
    try {
      // Check account exist on backend yet? 
      // Create account if not yet for get balance of account from backend
      // Remove when connect direct to TomoX
      const accountInfo = await fetchAccountInfo(address.addressString)
      if (!accountInfo) { await createAccount(address.addressString) }

      window.signer.instance.setAddress(address)
      dispatch(actionCreators.loginWithLedgerWallet(address.addressString))
    } catch (e) {
      dispatch(
        notifierActionCreators.addNotification({ message: 'Login error' })
      )
      dispatch(actionCreators.loginError(e.message))
    }
  }
}
