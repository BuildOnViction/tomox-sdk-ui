import React from 'react'
import { shallow } from 'enzyme'
import OrderBook from './OrderBook'

it('renders without crashing', () => {
  const props = {
    bids: [],
    asks: [],
    currentPair: {
      baseTokenSymbol: "TOMO",
      quoteTokenSymbol: "BTC",
    },
  }

  shallow(<OrderBook {...props} />)
})
