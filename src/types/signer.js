//@flow
import type { Signature, Transaction } from './common';
import type { NewOrderParams, Order, RawOrder, OrderCancel } from './orders';
import type { Trade } from './trades';
import type { Provider } from './network';

export type SignerState = {
  +loading: boolean,
  +error: string,
  +type: string,
  +url: string,
  +networkId: number
};

export type Signer = {
  privateKey: string,
  provider: Provider,
  signMessage: Object => Promise<Signature>,
  signOrder: RawOrder => Promise<RawOrder>,
  signTrade: Trade => Promise<Trade>,
  // the first param by default is this signer
  createRawOrder: NewOrderParams => Promise<Order>,
  sendTransaction:  Transaction => Promise<Object>,
  getAddress:() => Promise<string>,  
  createOrderCancel: string => OrderCancel,  
  updateSwarmFeed: (string, any) => Promise<boolean>
};

export type UpdateSignerParams = {
  type: 'metamask' | 'wallet' | 'rpc',
  custom: boolean,
  url: ?string,
  networkId: ?number,
  wallet: ?Object
};

export type SignerSettings = {
  type: string,
  url?: string,
  networkId?: number
};

export type UpdateSignerAction = {
  type: 'signerSettings/UPDATE_SIGNER',
  payload: {
    params: UpdateSignerParams,
    address: ?string
  }
};

export type SignerErrorAction = {
  type: 'signerSettings/ERROR',
  payload: { message: string }
};

export type RequestSignerAction = {
  type: 'signerSettings/REQUEST_SIGNER'
};

export type SignerEvent = any => SignerState => SignerState;
export type SignerSettingsAction =
  | UpdateSignerAction
  | SignerErrorAction
  | RequestSignerAction;
