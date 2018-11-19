//@flow

export type Status = 'incomplete' | 'valid' | 'invalid';

export type TxStatus = Status | 'sent' | 'reverted' | 'confirmed' | 'error';

export type Symbol = string;

export type Address = string;

export type TxHash = string;

export type Signature = {+r: string,
  +s: string,
  +v: string
};

export type TxReceipt = {
  blockHash: string,
  blockNumber: string,
  gasLimit: Object,
  hash: string
};