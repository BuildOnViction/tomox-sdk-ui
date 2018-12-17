import { connect } from 'react-redux'
import getTomoBalance from '../../store/models/tomoBalance'
import * as tomoBalanceActionCreators from '../../store/models/tomoBalance'

export function mapStateToProps(state, props) {
  const tomoBalance = getTomoBalance(state)

  return {
    balance: tomoBalance.get(props.address),
    isSubscribed: tomoBalance.isSubscribed(props.address)
  }
}

export function mapDispatchToProps(dispatch, props) {
  return {
    subscribeBalance: () => dispatch(tomoBalanceActionCreators.subscribeBalance(props.address))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
