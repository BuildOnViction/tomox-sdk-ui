// @flow
import React from 'react'
import NotificationsRenderer from './NotificationsRenderer'

class Notifications extends React.PureComponent {

    render() {
        const { notifications } = this.props

        return (<NotificationsRenderer notifications={notifications} />)
    }    
}

export default Notifications