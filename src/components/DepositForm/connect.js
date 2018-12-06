// @flow
import { connect } from 'react-redux';
import getDepositFormSelector, {
  confirmEtherDeposit,
  confirmTokenDeposit,
  queryBalances,
  subscribeBalance,
  updateAddressAssociation
} from '../../store/models/depositForm';

import type { State } from '../../types';

const depositChain = 'ethereum';

export const mapStateToProps = (state: State, ownProps: Object) => {
  const depositFormSelector = getDepositFormSelector(state);
  // by default we choose ethereum
  return {
    token: ownProps.token,
    tokens: depositFormSelector.rankedTokens(),
    chain: depositChain,
    addressAssociation: depositFormSelector.getAddressAssociation(depositChain),
    balances: depositFormSelector.balances(),
    associatedAddress: depositFormSelector.associatedAddress(),
    address: depositFormSelector.accountAddress(),
    step: depositFormSelector.getStep(),
    convertTx: depositFormSelector.getConvertTxState(),
    allowTx: depositFormSelector.getAllowTxState()
  };
};

export const mapDispatchToProps = {
  subscribeBalance,
  queryBalances,
  confirmEtherDeposit,
  confirmTokenDeposit,
  updateAddressAssociation
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
