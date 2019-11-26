import React from 'react'
import { shallow } from 'enzyme'
import MarketsTable from './MarketsTable'

it('renders without crashing', () => {
    const props = {
        quoteTokens: [],
    }

    shallow(<MarketsTable {...props} />)
})
