//@flow

export type Chain = string;

export type AddressAssociation = {
  +protocolVersion: number,
  +address: string,
  +signer: string
};

export type AddressAssociationPayload = {
  chain: Chain,
  addressAssociation: AddressAssociation
};

export type AssociationTransactionsPayload = {
  chain: Chain,
  txEnvelopes: string[]
};

export type DepositState = {
  +blockchain: Chain[],
  +transactions: {
    [Chain]: string[]
  },
  +byBlockchain: {
    [Chain]: AddressAssociation
  }
};

export type UpdateAddressAssociationAction = {
  type: 'deposit/UPDATE_ADDRESS_ASSOCIATION',
  payload: AddressAssociationPayload
};

export type UpdateAssociationTransactionsAction = {
  type: 'deposit/UPDATE_ASSOCIATION_TRANSACTIONS',
  payload: AssociationTransactionsPayload
};

export type DepositEvent = any => DepositState => DepositState;
export type DepositAction =
  | UpdateAddressAssociationAction
  | UpdateAssociationTransactionsAction;
