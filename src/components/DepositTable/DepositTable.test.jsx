import React from 'react'
import { shallow } from 'enzyme'
import DepositTable from './DepositTable'

it('renders without crashing', () => {
    shallow(<DepositTable />)
})
