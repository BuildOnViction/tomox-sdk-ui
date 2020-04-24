// @flow
import { connect } from 'react-redux'
import 
  lendingOrdersSelector, 
  { 
    cancelLendingOrder,
    topUpLendingOrder,
    repayLendingOrder,
  } 
from '../../../store/models/lending/lendingOrders'

import type { State } from '../../../types'

export const mapStateToProps = (state: State) => {
  const selector = lendingOrdersSelector(state)

  return {...selector}
}

export const mapDispatchToProps = { 
  cancelOrder: cancelLendingOrder,
  topUpLendingOrder,
  repayLendingOrder,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
