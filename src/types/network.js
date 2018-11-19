//@flow

export type Network = {
  chainId: number,
  name: ?string
};

export type Connection = {
  url: string
};

export type Provider = {
  connection: Connection,
  network: Network
};
