// @flow
import { connect } from 'react-redux'
import orderFormSelector, { sendNewOrder, unlockPair, redirectToLoginPage } from '../../store/models/orderForm'
import type { State } from '../../types'

export const mapStateToProps = (state: State) => {
  return orderFormSelector(state)
}

export const mapDispatchToProps = {
  sendNewOrder,
  unlockPair,
  redirectToLoginPage,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
