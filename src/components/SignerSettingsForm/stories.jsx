import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { text, withKnobs } from '@storybook/addon-knobs/react'
import { withInfo } from '@storybook/addon-info'
import SignerSettingsFormContainer from './index'
import SignerSettingsForm from './SignerSettingsForm'
import SignerSettingsFormRenderer from './SignerSettingsFormRenderer'
import { TOMOCHAIN_NODE_HTTP_URL, DEFAULT_NETWORK_ID } from '../../config/environment'
import README from './README.md'

const networks = [
  { name: 'Mainnet', id: 1 },
  { name: 'Ropsten', id: 3 },
  { name: 'Rinkeby', id: 4 },
  { name: 'Private', id: 1000 },
  { name: 'Private', id: DEFAULT_NETWORK_ID },
].map((m, index) => ({ ...m, rank: index + 1 }))

storiesOf('SignerSettingsForm', module)
  .addDecorator(withKnobs)
  .add(
    'Connected Signer Settings',
    withInfo({
      text: README,
      propTablesExclude: [SignerSettingsFormContainer],
      source: false,
    })(() => (
      <div className="bp3-dark">
        <SignerSettingsFormContainer />
      </div>
    ))
  )
  .add(
    'Signer Settings',
    withInfo()(() => (
      <div className="bp3-dark">
        <SignerSettingsForm
          loading={false}
          error=""
          currentSigner={{
            type: 'rpc',
            url: TOMOCHAIN_NODE_HTTP_URL,
            networkId: DEFAULT_NETWORK_ID,
          }}
          updateSigner={action('updateSigner')}
        />
      </div>
    ))
  )
  .add(
    'Renderer (Non expanded)',
    withInfo()(() => (
      <div className="bp3-dark">
        <SignerSettingsFormRenderer
          options={{ provider: 'metamask', type: '', url: '', networkId: DEFAULT_NETWORK_ID }}
          currentSigner={{
            type: 'local',
            url: TOMOCHAIN_NODE_HTTP_URL,
            networkId: DEFAULT_NETWORK_ID,
          }}
          handleSubmit={action('handleSubmit')}
          handleChange={action('handleChange')}
          handleNetworkChange={action('handleNetworkChange')}
          networks={networks}
        />
      </div>
    ))
  )
  .add(
    'Renderer (Non expanded) - Loading',
    withInfo()(() => (
      <div className="bp3-dark">
        <SignerSettingsFormRenderer
          loading
          options={{ provider: 'metamask', type: '', url: '', networkId: 1 }}
          currentSigner={{
            type: 'local',
            url: TOMOCHAIN_NODE_HTTP_URL,
            networkId: DEFAULT_NETWORK_ID,
          }}
          handleSubmit={action('handleSubmit')}
          handleChange={action('handleChange')}
          handleNetworkChange={action('handleNetworkChange')}
          error=""
          networks={networks}
        />
      </div>
    ))
  )
  .add(
    'Renderer (Custom - Expanded)',
    withInfo()(() => (
      <div className="bp3-dark">
        <SignerSettingsFormRenderer
          error=""
          type="wallet"
          url="https://my.node.com"
          custom={true}
          networkId={2}
          customType=""
          currentSigner={{
            type: 'wallet',
            url: TOMOCHAIN_NODE_HTTP_URL,
            networkId: DEFAULT_NETWORK_ID,
          }}
          handleSubmit={action('handleSubmit')}
          handleChange={action('handleChange')}
          handleNetworkChange={action('handleNetworkChange')}
          networks={networks}
          wallet=""
        />
      </div>
    ))
  )
  .add(
    'Renderer (Custom - Expanded - Error)',
    withInfo()(() => (
      <div className="bp3-dark">
        <SignerSettingsFormRenderer
          error="Invalid Json Response"
          type="wallet"
          url="https://my.node.com"
          custom={true}
          networkId={2}
          customType=""
          currentSigner={{
            type: 'local',
            url: TOMOCHAIN_NODE_HTTP_URL,
            networkId: DEFAULT_NETWORK_ID,
          }}
          handleSubmit={action('handleSubmit')}
          handleChange={action('handleChange')}
          handleNetworkChange={action('handleNetworkChange')}
          networks={networks}
        />
      </div>
    ))
  )
