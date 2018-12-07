//@flow

export type Status = 'incomplete' | 'valid' | 'invalid';

// export type TxStatus = Status | 'sent' | 'reverted' | 'confirmed' | 'error';
export type TxStatus =
  | 'incomplete'
  | 'valid'
  | 'invalid'
  | 'sent'
  | 'reverted'
  | 'confirmed'
  | 'error';

export type ProviderType = 'homestead' | 'rinkeby' | 'local' | 'web3' | 'rpc';

export type Symbol = string;

export type Address = string;

export type TxHash = string;

export type Signature = { +r: string, +s: string, +v: string };

export type Transaction = {
  gasLimit: number,
  gasPrice: number,
  to: string,
  value: Object,
  data?: ?Object
};

export type TxReceipt = {
  blockHash: string,
  blockNumber: string,
  gasLimit: Object,
  hash: string
};

export type BN = {
  div: any,
  mul: any
};

export type Numberish = string | number;
