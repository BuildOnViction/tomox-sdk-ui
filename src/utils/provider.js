//@flow

import { providers } from 'ethers';
import { DEFAULT_NETWORK_ID } from '../config/environment';
import { NETWORK_URL } from '../config/url';

import type { ProviderType } from '../types/common';
import type { Provider } from '../types/signer';

export const createProvider = (
  providerType: ProviderType,
  networkId?: ?number,
  url?: ?string
): Provider => {
  switch (providerType) {
    case 'homestead':
      return new providers.InfuraProvider('homestead');
    case 'rinkeby':
      return new providers.InfuraProvider('rinkeby');
    case 'local':
      return new providers.JsonRpcProvider(NETWORK_URL, {
        chainId: parseInt(DEFAULT_NETWORK_ID, 10),
        name: undefined
      });
    case 'web3':
      return new providers.Web3Provider(window.web3.currentProvider, {
        chainId: networkId
      });
    case 'rpc':
    default:
      return new providers.JsonRpcProvider(url, {
        chainId: networkId,
        name: 'unspecified'
      });
  }
};
