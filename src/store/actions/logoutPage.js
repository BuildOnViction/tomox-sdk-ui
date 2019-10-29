//@flow
import type { LogoutAction } from '../../types/logoutPage'

const actionTypes = {
  logout: 'logoutPage/LOGOUT',
  resetTradesByAddress: 'logoutPage/RESET_TRADES_BY_ADDRESS',
  resetBalances: 'logoutPage/RESET_BALANCES',
  ordersReset: 'logoutPage/ORDER_RESET',
  resetNotifications: 'logoutPage/RESET_NOTIFICATIONS',
}

export function resetNotifications() {
  return {
    type: actionTypes.resetNotifications,
  }
}

export function ordersReset() {
  return {
    type: actionTypes.ordersReset,
  }
}

export function resetBalances(): ResetAccountBalancesAction {
  return {
    type: actionTypes.resetBalances,
  }
}

export function resetTradesByAddress() {
  return {
    type: actionTypes.resetTradesByAddress,
  }
}

export function logout(): LogoutAction {
  return {
    type: actionTypes.logout,
  }
}

export default actionTypes
