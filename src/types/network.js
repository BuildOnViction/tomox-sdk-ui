//@flow

import type { Transaction } from './common';

export type Network = {
  chainId: number,
  name: ?string
};

export type Connection = {
  url: string
};

type Callback = (string, string, string) => Promise<void>;

export type Provider = {
  connection: Connection,
  network: Network,
  waitForTransaction: (string, ?number) => Promise<Object>,
  getTransactionCount: string => Promise<number>,
  getBalance: string => Promise<number>,
  estimateGas: Transaction => Promise<Object>,
  removeListener: (eventType: string, callback: Callback) => boolean,
  on: (string, callback: Callback) => void
};
