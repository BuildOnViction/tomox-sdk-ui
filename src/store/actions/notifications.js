// @flow
const actionTypes = {
  addNotifications: 'notifications/ADD_NOTIFICATIONS',
  updateNotificationsLoading: 'notifications/UPDATE_NOTIFICATIONS_LOADING',
  updateNewNotifications: 'notifications/UPDATE_NEW_NOTIFICATIONS',
  resetNewNotifications: 'notifications/RESET_NEW_NOTIFICATIONS',
  markNotificationRead: 'notifications/MARK_NOTIFICATION_READ',
}

export function updateNotificationsLoading(status: Boolean) {
  return {
    type: actionTypes.updateNotificationsLoading,
    payload: { status },
  }
}

export function addNotifications(data: Array<Object>) {
  return {
    type: actionTypes.addNotifications,
    payload: { data },
  }
}

export function updateNewNotifications(data: Array<Object>) {
  return {
    type: actionTypes.updateNewNotifications,
    payload: { data },
  }
}

export function resetNewNotifications() {
  return {
    type: actionTypes.resetNewNotifications,
  }
}

export function markNotificationRead(data: String) {
  return {
    type: actionTypes.markNotificationRead,
    payload: { data },
  }
}

export default actionTypes
