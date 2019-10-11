// @flow
import { connect } from 'react-redux';

import getGetStartedModalSelector, {
  convertETH,
  approveWETH,
  redirectToTradingPage
} from '../../store/models/getStartedModal';
import type { State } from '../../types';

export const mapStateToProps = (state: State, ownProps: Object) => {
  const selector = getGetStartedModalSelector(state);

  return {
    TomoBalance: selector.TomoBalance(),
    TOMOAddress: selector.TOMOAddress(),
    WETHBalance: selector.WETHBalance(),
    approveTxState: selector.approveTxState(),
    convertTxState: selector.convertTxState(),
    closeModal: ownProps.closeHelpModal
  };
};

const mapDispatchToProps = {
  convertETH,
  approveWETH,
  redirectToTradingPage
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
