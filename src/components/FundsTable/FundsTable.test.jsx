import React from 'react'
import { shallow } from 'enzyme'
import FundsTable from './FundsTable'

it('renders without crashing', () => {
    const props = {
        tokenData: [],
    }

    shallow(<FundsTable {...props} />)
})
