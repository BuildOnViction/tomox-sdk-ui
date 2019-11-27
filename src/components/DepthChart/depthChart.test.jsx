import React from 'react'
import { shallow } from 'enzyme'
import DepthChart from './DepthChart'

it('renders without crashing', () => {
  const props = {
    bids: [],
    asks: [],
  }

  shallow(<DepthChart {...props} />)
})
