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

export function loginWithMetamask(address: string): LoginWithMetamaskAction {
  return {
    type: actionTypes.loginWithMetamask,
    payload: { address },
  }
}

export function loginWithWallet(
  address: string,
  privateKey: string
): LoginWithWalletAction {
  return {
    type: actionTypes.loginWithWallet,
    payload: { address, privateKey },
  }
}

export function loginWithTrezorWallet(
  address: string
): LoginWithTrezorWalletAction {
  return {
    type: actionTypes.loginWithTrezorWallet,
    payload: { address },
  }
}

export function loginWithLedgerWallet(
  address: string
): LoginWithLedgerWalletAction {
  return {
    type: actionTypes.loginWithLedgerWallet,
    payload: { address },
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
  privateKey: string
): LoginWithWalletAction {
  return {
    type: actionTypes.loginWithWalletConnect,
    payload: { address },
  }
}

export default actionTypes
