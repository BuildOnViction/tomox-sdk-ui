//@flow
import type {
  CreateWalletAction,
  LoginErrorAction,
  LoginWithMetamaskAction,
  LoginWithWalletAction,
  LoginWithTrezorWalletAction,
  LoginWithLedgerWalletAction,
  RequestLoginAction,
} from '../../types/loginPage'

const actionTypes = {
  createWallet: 'loginPage/CREATE_WALLET',
  requestLogin: 'loginPage/REQUEST_LOGIN',
  loginWithMetamask: 'loginPage/LOGIN_WITH_METAMASK',
  loginWithWallet: 'loginPage/LOGIN_WITH_WALLET',
  loginWithTrezorWallet: 'loginPage/LOGIN_WITH_TREZOR_WALLET',
  loginWithLedgerWallet: 'loginPage/LOGIN_WITH_LEDGER_WALLET',
  loginWithWalletConnect: 'loginPage/LOGIN_WITH_WALLET_CONNECT',
  loginError: 'loginPage/LOGIN_ERROR',
  getPublicKey: 'loginPage/GET_PUBLIC_KEY',
  toggleSelectAddressModal: 'loginPage/TOGGLE_SELECT_ADDRESS_MODAL',
}

export function createWallet(
  address: string,
  encryptedWallet: string
): CreateWalletAction {
  return {
    type: actionTypes.createWallet,
    payload: { address, encryptedWallet },
  }
}

export function loginWithMetamask(address: string, type: string): LoginWithMetamaskAction {
  return {
    type: actionTypes.loginWithMetamask,
    payload: { address, type },
  }
}

export function loginWithWallet(
  address: string,
  type: string,
  privateKey: string
): LoginWithWalletAction {
  return {
    type: actionTypes.loginWithWallet,
    payload: { address, type, privateKey },
  }
}

export function loginWithTrezorWallet(
  address: string, 
  type: string
): LoginWithTrezorWalletAction {
  return {
    type: actionTypes.loginWithTrezorWallet,
    payload: { address, type },
  }
}

export function loginWithLedgerWallet(
  address: string,
  type: string
): LoginWithLedgerWalletAction {
  return {
    type: actionTypes.loginWithLedgerWallet,
    payload: { address, type },
  }
}

export function loginError(error: string): LoginErrorAction {
  return {
    type: actionTypes.loginError,
    payload: { error },
  }
}

export function requestLogin(): RequestLoginAction {
  return {
    type: actionTypes.requestLogin,
  }
}

export function getPublicKey(data: Object) {
  return {
    type: actionTypes.getPublicKey,
    payload: data,
  }
}

export function toggleSelectAddressModal(isOpen: boolean) {
  return {
    type: actionTypes.toggleSelectAddressModal,
    payload: isOpen,
  }
}

export function loginWithWalletConnect(
  address: string,
  type: string
): LoginWithWalletAction {
  return {
    type: actionTypes.loginWithWalletConnect,
    payload: { address, type },
  }
}

export default actionTypes
