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
                dispatch(notificationsCreators.addNotifications(notifications))
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

export function resetNotifications(): ThunkAction {
    return async (dispatch) => {
        dispatch(notificationsCreators.resetNotifications())
    }
}

export function resetNewNotifications(): ThunkAction {
    return async (dispatch) => {
        dispatch(notificationsCreators.resetNewNotifications())
    }
}

export function markAllNotificationsRead(userAddress): ThunkAction {
    return async (dispatch, getState, { api }) => {
        try {
            await api.markAllNotificationsRead(userAddress)
            const state = getState()
            let notifications = getNotificationsDomain(state).getNotifications()
            notifications = notifications.map(notification => {
                notification.status = 'READ'
                return notification
            })

            dispatch(notificationsCreators.markNotificationRead(notifications))
        } catch(error) {
            console.log(error)
        }        
    }
}

export function markNotificationRead(id): ThunkAction {
    return async (dispatch, getState, { api }) => {
        try {
            await api.markNotificationRead(id)
            const state = getState()
            let notifications = getNotificationsDomain(state).getNotifications()
            notifications = notifications.map(notification => {
                if (notification.id === id) notification.status = 'READ'
                return notification
            })

            dispatch(notificationsCreators.markNotificationRead(notifications))
        } catch(error) {
            console.log(error)
        }        
    }
}

export function markNotificationUnRead(id): ThunkAction {
    return async (dispatch, getState, { api }) => {
        try {
            await api.markNotificationUnRead(id)
            const state = getState()
            let notifications = getNotificationsDomain(state).getNotifications()
            notifications = notifications.map(notification => {
                if (notification.id === id) notification.status = 'UNREAD'
                return notification
            })

            dispatch(notificationsCreators.markNotificationRead(notifications))
        } catch(error) {
            console.log(error)
        }        
    }
}

export default function notificationsSelector(state: State) {
    const notificationsDomain = getNotificationsDomain(state)
    const accountDomain = getAccountDomain(state)
    return {
        offset: notificationsDomain.getOffset(),
        limit: notificationsDomain.getLimit(),
        notifications: notificationsDomain.getNotifications(),
        newNotifications: notificationsDomain.getNewNotifications(),
        loading: notificationsDomain.getLoading(),
        toaster: notificationsDomain.getToaster(),
        address: accountDomain.address(),
        authenticated: accountDomain.authenticated(),
    }
}