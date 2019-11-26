import React from 'react'
import { shallow } from 'enzyme'
import OrderBook from './OrderBook'

it('renders without crashing', () => {
  const props = {
    bids: [],
    asks: [],
  }

  shallow(<OrderBook {...props} />)
})
