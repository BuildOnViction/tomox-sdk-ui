// @flow
import { connect } from 'react-redux'
import orderFormSelector, { sendNewLendingOrder, redirectToLoginPage } from '../../../store/models/lending/lendingOrderForm'
import type { State } from '../../../types'

export const mapStateToProps = (state: State) => {
  return orderFormSelector(state)
}

export const mapDispatchToProps = {
  sendNewLendingOrder,
  redirectToLoginPage,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
