// @flow
const actionTypes = {
  updateNotifications: 'notifications/UPDATE_NOTIFICATIONS',
  updateNotificationsLoading: 'notifications/UPDATE_NOTIFICATIONS_LOADING',
  updateNewNotifications: 'notifications/UPDATE_NEW_NOTIFICATIONS',
  resetNewNotifications: 'notifications/RESET_NEW_NOTIFICATIONS',
}

export function updateNotificationsLoading(status: Boolean) {
  return {
    type: actionTypes.updateNotificationsLoading,
    payload: { status },
  }
}

export function updateNotifications(data: Array<Object>) {
  return {
    type: actionTypes.updateNotifications,
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

export default actionTypes
