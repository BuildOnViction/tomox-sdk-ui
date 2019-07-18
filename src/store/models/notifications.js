// @flow
import {
    getAccountDomain,
    getNotificationsDomain,
  } from '../domains'
import * as notifierActionCreators from '../actions/app'
import * as notificationsCreators from '../actions/notifications'
import type { State } from '../../types'

export function getNotifications(): ThunkAction {
    return async (dispatch, getState, { api }) => {
        const state = getState()
        const accountAddress = getAccountDomain(state).address()
        const notificationsDomain = getNotificationsDomain(state)
        const offset = notificationsDomain.getOffset()
        const limit = notificationsDomain.getLimit()

        try {
            dispatch(notificationsCreators.updateNotificationsLoading(true))
            const notifications = await api.fetchNotifications({ address: accountAddress, offset, limit })
            if (notifications.length > 0) {
                dispatch(notificationsCreators.updateNotifications(notifications))
            }
            dispatch(notificationsCreators.updateNotificationsLoading(false))            
        } catch(error) {
            dispatch(
                notifierActionCreators.addErrorNotification({
                  message: 'Could not get notifications',
                })
            )
            console.log(error)
        }
    }
}

export function resetNewNotifications(): ThunkAction {
    return async (dispatch) => {
        dispatch(notificationsCreators.resetNewNotifications())
    }
}

export default function notificationsSelector(state: State) {
    const notificationsDomain = getNotificationsDomain(state)
    return {
        offset: notificationsDomain.getOffset(),
        limit: notificationsDomain.getLimit(),
        notifications: notificationsDomain.getNotifications(),
        newNotifications: notificationsDomain.getNewNotifications(),
        loading: notificationsDomain.getLoading(),
        toaster: notificationsDomain.getToaster(),
    }
}