// @flow
import { addKeyToObject } from '../../helpers/utils';

import type {
  DepositState,
  Chain,
  AddressAssociation
} from '../../types/deposit';

const initialState = {
  blockchain: ['ethereum'],
  transactions: { ethereum: [] },
  byBlockchain: {
    ethereum: {
      protocolVersion: 0,
      address: '',
      signer: ''
    }
  }
};

export const initialized = () => {
  const event = (state: DepositState = initialState) => state;
  return event;
};

export const addressAssociationUpdated = (
  chain: Chain,
  addressAssociation: AddressAssociation
) => {
  const event = (state: DepositState) => ({
    ...state,
    byBlockchain: addKeyToObject(state.byBlockchain, chain, addressAssociation)
  });
  return event;
};

export const associationTransactionsUpdated = (
  chain: Chain,
  txEnvelopes: string[]
) => {
  const event = (state: DepositState) => ({
    ...state,
    transactions: addKeyToObject(state.transactions, chain, txEnvelopes)
  });
  return event;
};

export default function depositDomain(state: DepositState) {
  return {
    blockchain: () => state.blockchain,
    getAddressAssociation: (chain: Chain) => state.byBlockchain[chain],
    getAssocationTransactions: (chain: Chain) => state.transactions[chain]
  };
}
