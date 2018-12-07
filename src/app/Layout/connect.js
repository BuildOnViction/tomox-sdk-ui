//@flow
import { connect } from 'react-redux';
import layoutSelector, { createProvider } from '../../store/models/layout';
// import * as actionCreators from '../../store/models/layout'
import type { State } from '../../types';
import type { Props as LayoutProps } from './Layout';

export function mapStateToProps(state: State, props: Object): LayoutProps {
  const selector = layoutSelector(state);

  return {
    ETHBalance: selector.ETHBalance,
    WETHBalance: selector.WETHBalance,
    WETHAllowance: selector.WETHAllowance,
    authenticated: selector.authenticated,
    authenticated: selector.authenticated,
    address: selector.address,
    currentBlock: selector.currentBlock,
    locale: 'en',
    messages: {},
    accountLoading: selector.accountLoading
  };
}

const mapDispatchToProps = {
  createProvider
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
);
