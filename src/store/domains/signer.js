// @flow
import type { SignerSettings, SignerState } from '../../types/signer'
import {
  TOMOCHAIN_NODE_HTTP_URL,
  DEFAULT_NETWORK_ID,
} from '../../config/environment'

const initialState = {
  loading: false,
  error: '',
  type: 'rpc',
  url: TOMOCHAIN_NODE_HTTP_URL,
  networkId: DEFAULT_NETWORK_ID,
}

export const initialized = () => {
  const event = (state: SignerState = initialState) => state
  return event
}

export const signerUpdated = ({ type, url, networkId }: SignerSettings) => {
  const event = (state: SignerState) => ({
    ...state,
    loading: false,
    error: null,
    type: type || state.type,
    url: url || state.url,
    networkId: networkId || state.networkId,
  })

  return event
}

export const signerRequested = () => {
  const event = (state: SignerState) => ({
    ...state,
    loading: true,
  })

  return event
}

export const signerError = (error: string) => {
  const event = (state: SignerState) => ({
    ...state,
    loading: false,
    error,
  })

  return event
}

export default function signerDomain(state: SignerState) {
  return {
    isLoading: () => state.loading,
    getError: () => state.error,
    getCurrentSigner: () => ({
      type: state.type,
      url: state.url,
      networkId: state.networkId,
    }),
    getType: () => state.type,
    getUrl: () => state.url,
    getNetworkId: () => state.networkId,
  }
}

// const localRPCProvider = {
//   type: 'local',
//   url: TOMOCHAIN_NODE_HTTP_URL,
//   networkID: 8888,
//   networkName: ''
// }

// const localWebsocketRPCProvider = {
//   type: 'local',
//   url: 'ws://127.0.0.1:8546',
//   networkID: 8888,
//   networkName: ''
// }

// const rinkebyInfuraWebsocketProvider = {
//   type: 'infura',
//   url: 'wss://rinkeby.infura.io/_ws',
//   networkID: 4,
//   networkName: 'rinkeby'
// }

// const testingMetamaskProvider = {
//   type: 'metamask',
//   networkID: 8888,
//   networkName: ''
// }

// const rinkebyMetamaskProvider = {
//   type: 'metamask',
//   networkID: 4,
//   networkName: 'rinkeby'
// }

// const initialState = {
//   loading: false,
//   error: '',
//   type: 'wallet',
//   url: TOMOCHAIN_NODE_HTTP_URL,
//   networkId: 8888,
// };
