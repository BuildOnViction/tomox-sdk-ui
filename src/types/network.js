//@flow

import type { Transaction } from './common';

export type Network = {
  chainId: number,
  name: ?string
};

export type Connection = {
  url: string
};

export type Provider = {
  connection: Connection,
  network: Network,
  waitForTransaction: (string, ?number) => Promise<Object>,
  getTransactionCount: string => Promise<number>,
  getBalance: string => Promise<number>,
  estimateGas: Transaction => Promise<Object>
};
