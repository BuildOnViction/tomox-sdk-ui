import React from 'react'
import { shallow } from 'enzyme'
import Notifications from './Notifications'

it('renders without crashing', () => {
    const props = {
        resetNewNotifications: jest.fn(),
    }

    shallow(<Notifications {...props} />)
})