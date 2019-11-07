//@flow

import type { Transaction } from './common'

export type Network = {
  chainId: number,
  name: ?string
};

export type Connection = {
  url: string
};
