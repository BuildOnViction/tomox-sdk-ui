// @flow
import * as actionCreators from '../actions/logoutPage'
import * as accountActionCreators from '../actions/account'
import { getAccountDomain } from '../domains'
import type { State, ThunkAction } from '../../types'

export default function logoutPageSelector(state: State) {
  return {
    authenticated: getAccountDomain(state).authenticated(),
  }
}

export function logout(): ThunkAction {
  return async dispatch => {
    if (window.getBalancesInterval) clearInterval(window.getBalancesInterval)
    if (window.signer && window.signer.type === 'walletConnect' && window.signer.instance.connector) {
      window.signer.instance.connector.killSession()
      window.signer.instance.connector = null
    }

    window.signer = null

    dispatch(actionCreators.resetBalances())
    dispatch(actionCreators.ordersReset())
    dispatch(actionCreators.resetTradesByAddress())
    dispatch(actionCreators.resetNotifications())    
    dispatch(accountActionCreators.updateCurrentBlock(''))
    dispatch(accountActionCreators.updateCurrentProvider(''))
    dispatch(actionCreators.logout())
  }
}
