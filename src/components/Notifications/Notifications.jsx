// @flow
import React from 'react'
import NotificationsRenderer from './NotificationsRenderer'

class Notifications extends React.PureComponent {
    componentDidMount() {
        this.props.resetNewNotifications()
    }

    render() {
        const { notifications, loading, getNotifications, markNotificationRead } = this.props

        return (
            <NotificationsRenderer 
                notifications={notifications}
                loading={loading}
                getNotifications={getNotifications}
                markNotificationRead={markNotificationRead} />
        )
    }    
}

export default Notifications