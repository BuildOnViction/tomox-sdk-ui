import React from 'react'
import { shallow } from 'enzyme'
import SignerSettingsForm from './SignerSettingsForm'
import {
  TOMOCHAIN_NODE_HTTP_URL,
  DEFAULT_NETWORK_ID,
} from '../../config/environment'

describe('Rendering', () => {
  it('renders without crashing', () => {
    shallow(
      <SignerSettingsForm
        loading={false}
        error=""
        currentSigner={{
          type: 'rpc',
          url: TOMOCHAIN_NODE_HTTP_URL,
          networkId: DEFAULT_NETWORK_ID,
        }}
        updateSigner={jest.fn()}
      />
    )
  })
})
