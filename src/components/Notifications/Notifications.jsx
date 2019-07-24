// @flow
import React from 'react'
import NotificationsRenderer from './NotificationsRenderer'

class Notifications extends React.PureComponent {
    componentUnMount() {
        this.props.resetNewNotifications()
    }

    render() {
        const { 
            address,
            notifications, 
            loading, 
            getNotifications, 
            markAllNotificationsRead,
            markNotificationRead,
            markNotificationUnRead,
        } = this.props

        return (
            <NotificationsRenderer 
                address={address}
                notifications={notifications}
                loading={loading}
                getNotifications={getNotifications}
                markAllNotificationsRead={markAllNotificationsRead}
                markNotificationRead={markNotificationRead}
                markNotificationUnRead={markNotificationUnRead} />
        )
    }    
}

export default Notifications