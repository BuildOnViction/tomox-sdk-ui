// @flow
import { connect } from 'react-redux'
import ordersTableSelector, { cancelOrder } from '../../store/models/ordersTable'

import type { State } from '../../types'

export const mapStateToProps = (state: State) => {
  const { orders, trades, currentPair, authenticated } = ordersTableSelector(state)

  return {
    orders,
    trades,
    currentPair,
    authenticated,
  }
}

export const mapDispatchToProps = { cancelOrder }

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
