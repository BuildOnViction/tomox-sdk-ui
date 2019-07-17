// @flow
import React from 'react'
import NotificationsRenderer from './NotificationsRenderer'

class Notifications extends React.PureComponent {

    render() {
        const { notifications, loading, getNotifications } = this.props

        return (
            <NotificationsRenderer 
                notifications={notifications}
                loading={loading}
                getNotifications={getNotifications} />
        )
    }    
}

export default Notifications