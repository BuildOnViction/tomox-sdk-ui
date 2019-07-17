// @flow
const actionTypes = {
  updateNotifications: 'notifications/UPDATE_NOTIFICATIONS',
  updateNotificationsLoading: 'notifications/UPDATE_NOTIFICATIONS_LOADING',
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

export default actionTypes
