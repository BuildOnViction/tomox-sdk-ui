//@flow

export type ConnectionState = {
  +connectedCount: number,
  +isConnecting: boolean
};

export type ConnectionEvent = any => ConnectionState => ConnectionState;
// export type ConnectionAction =
//   | UpdateAddressAssociationAction
//   | UpdateAssociationTransactionsAction;
