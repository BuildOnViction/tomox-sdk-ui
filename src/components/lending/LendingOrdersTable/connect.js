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

export const mapStateToProps = (state: State) => {
  const data = lendingOrdersSelector(state)

  return {...data}
}

export const mapDispatchToProps = { 
  cancelLendingOrder,
  topUpLendingOrder,
  repayLendingOrder,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
