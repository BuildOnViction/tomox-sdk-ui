// @flow
const actionTypes = {
  updateNotifications: 'notifications/UPDATE_NOTIFICATIONS',
}

export function updateNotifications(data) {
  return {
    type: actionTypes.updateNotifications,
    payload: { data },
  }
}

export default actionTypes
