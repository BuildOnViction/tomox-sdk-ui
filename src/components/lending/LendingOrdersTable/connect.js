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
  const { orders, trades, currentPair, currentPairData, authenticated } = lendingOrdersSelector(state)

  return {
    orders,
    trades,
    currentPair,
    currentPairData,
    authenticated,
  }
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
