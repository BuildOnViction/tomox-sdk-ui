// @flow
import React from 'react'
import NotificationsRenderer from './NotificationsRenderer'

class Notifications extends React.PureComponent {
    componentDidMount() {
        const { authenticated, getNotifications, resetNewNotifications, address, offset, limit } = this.props
        resetNewNotifications()
        if (authenticated) getNotifications(address, offset, limit)
    }

    componentWillUnmount() {
        this.props.resetNotifications()
    }

    render() {
        const { 
            authenticated,
            address,
            notifications, 
            loading, 
            getNotifications, 
            markAllNotificationsRead,
            markNotificationRead,
            markNotificationUnRead,
        } = this.props

        if (!authenticated) return null

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