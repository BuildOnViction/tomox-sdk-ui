// @flow
import { connect } from 'react-redux'
import ordersTableSelector, { cancelLendingOrder } from '../../../store/models/lending/lendingOrders'

import type { State } from '../../../types'

export const mapStateToProps = (state: State) => {
  const { orders, trades, currentPair, currentPairData } = ordersTableSelector(state)

  return {
    orders,
    trades,
    currentPair,
    currentPairData,
  }
}

export const mapDispatchToProps = { cancelOrder: cancelLendingOrder }

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
