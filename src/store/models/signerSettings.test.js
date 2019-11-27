import createStore from '../../store/configureStore'
import * as signerService from '../services/signer'
import { TOMOCHAIN_NODE_HTTP_URL, DEFAULT_NETWORK_ID } from '../../config/environment'

import getSignerSettingsSelector from './signerSettings'
import * as actionCreators from './signerSettings'
import { getAccountDomain } from '../domains'

jest.mock('../services/signer')

let selector
let accountSelector

it('returns default provider state', () => {
  const { store } = createStore()

  selector = getSignerSettingsSelector(store.getState())
  expect(selector.getType()).toEqual('rpc')
  expect(selector.getNetworkId()).toEqual(DEFAULT_NETWORK_ID)
  expect(selector.getUrl()).toEqual(TOMOCHAIN_NODE_HTTP_URL)
})

it('handles setProvider (metamask) properly', async () => {
  signerService.createSigner.mockReturnValue(
    Promise.resolve({
      address: 'test address',
      settings: { type: 'metamask' },
    })
  )

  const { store } = createStore()
  await store.dispatch(actionCreators.updateSigner('test signerParams'))

  selector = getSignerSettingsSelector(store.getState())
  accountSelector = getAccountDomain(store.getState())
  expect(signerService.createSigner).toHaveBeenCalledTimes(1)
  expect(signerService.createSigner).toHaveBeenCalledWith('test signerParams')
  expect(selector.getType()).toEqual('metamask')
  expect(accountSelector.address()).toEqual('test address')
})
