//@flow
import { connect } from 'react-redux'
import layoutSelector, {
  createProvider,
  changeLocale,
  queryAppData,
} from '../../store/models/layout'
import type { State } from '../../types'
import type { Props as LayoutProps } from './Layout'

export function mapStateToProps(state: State, props: Object): LayoutProps {
  const selector = layoutSelector(state)

  return {
    TomoBalance: selector.TomoBalance,
    authenticated: selector.authenticated,
    address: selector.address,
    currentBlock: selector.currentBlock,
    accountLoading: selector.accountLoading,
    locale: selector.locale,
    currentPair: selector.currentPair,
    currentPairData: selector.currentPairData,
    pathname: selector.pathname,
    referenceCurrency: selector.referenceCurrency,
  }
}

const mapDispatchToProps = {
  createProvider,
  changeLocale,
  queryAppData,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
