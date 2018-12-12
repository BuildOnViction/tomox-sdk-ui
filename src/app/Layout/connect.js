//@flow
import { connect } from 'react-redux'
import layoutSelector, {
  createProvider,
  changeLocale,
} from '../../store/models/layout'
// import * as actionCreators from '../../store/models/layout'
import type { State } from '../../types'
import type { Props as LayoutProps } from './Layout'

export function mapStateToProps(state: State, props: Object): LayoutProps {
  const selector = layoutSelector(state)

  return {
    ETHBalance: selector.ETHBalance,
    WETHBalance: selector.WETHBalance,
    WETHAllowance: selector.WETHAllowance,
    authenticated: selector.authenticated,
    address: selector.address,
    currentBlock: selector.currentBlock,
    accountLoading: selector.accountLoading,
    locale: selector.locale,
  }
}

const mapDispatchToProps = {
  createProvider,
  changeLocale,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
