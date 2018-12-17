import { getTomoBalanceDomain } from '../domains'

import * as actionCreators from '../actions/tomoBalance'
import * as ether from '../services/ether'

export default function getEtherTxSelector(state) {
  return getTomoBalanceDomain(state)
}

export function subscribeBalance(address) {
  return (dispatch, getState) => {
    const state = getState()
    const model = getEtherTxSelector(state)

    if (model.isSubscribed(address)) {
      return
    }

    dispatch(actionCreators.subscribeBalance(address))

    const unsubscribe = ether.subscribeBalance(address, balance => {
      dispatch(actionCreators.updateBalance(address, balance))
    })

    return () => {
      unsubscribe()
      dispatch(actionCreators.unsubscribeBalance(address))
    }
  }
}
