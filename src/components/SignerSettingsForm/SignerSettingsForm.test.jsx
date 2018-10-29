import React from 'react';
import { shallow } from 'enzyme';
import SignerSettingsForm from './SignerSettingsForm';
import { NETWORK_URL } from '../../config/url';

describe('Rendering', () => {
  it('renders without crashing', () => {
    shallow(
      <SignerSettingsForm
        loading={false}
        error=""
        currentSigner={{ type: 'rpc', url: NETWORK_URL, networkId: 8888 }}
        updateSigner={jest.fn()}
      />
    );
  });
});
