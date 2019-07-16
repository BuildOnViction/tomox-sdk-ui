// @flow
import { getNotificationsDomain } from '../domains'
import type { State } from '../../types'

export default function notificationsSelector(state: State) {
    const notificationsDomain = getNotificationsDomain(state)
    return {
        offset: notificationsDomain.getOffset(),
        limit: notificationsDomain.getLimit(),
        notifications: notificationsDomain.getNotifications(),
        newNotifications: notificationsDomain.getNewNotifications(),
    }
}