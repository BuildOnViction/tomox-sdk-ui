// @flow
import type {
  AddressAssociation,
  Chain,
  UpdateAddressAssociationAction,
  UpdateAssociationTransactionsAction
} from '../../types/deposit';

const actionTypes = {
  updateAddressAssociation: 'deposit/UPDATE_ADDRESS_ASSOCIATION',
  updateAssociationTransactions: 'deposit/UPDATE_ASSOCIATION_TRANSACTIONS'
};

export function updateAddressAssociation(
  chain: Chain,
  addressAssociation: AddressAssociation
): UpdateAddressAssociationAction {
  return {
    type: actionTypes.updateAddressAssociation,
    payload: { chain, addressAssociation }
  };
}

export function updateAssociationTransactions(
  chain: Chain,
  txEnvelopes: string[]
): UpdateAssociationTransactionsAction {
  return {
    type: actionTypes.updateAssociationTransactions,
    payload: { chain, txEnvelopes }
  };
}

export default actionTypes;
