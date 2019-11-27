import getOrdersDomain, * as eventCreators from './orders'

function getDomain(events) {
  const state = events.reduce((state, event) => event(state), undefined)
  return getOrdersDomain(state)
}

const orders = [
  {
    amount: 3606.63,
    price: 53983.52,
    type: 'MO',
    side: 'SELL',
    hash: '0x239c611ce10346eba1fe08dbc5542499a1e6bf5675070fa7ef809dc85d75f7c9',
    pair: 'BTC/TOMO',
    time: 1504567900560,
  },
  {
    amount: 5765.64,
    price: 98517.23,
    type: 'MO',
    side: 'SELL',
    hash: '0x8c3122d67b7836f641a39e694b3b61f817ced9a9131d4287db30e1f05494f46a',
    pair: 'ETH/TOMO',
    time: 1506911142876,
  },
  {
    amount: 2885.5,
    price: 23798.09,
    type: 'LI',
    side: 'SELL',
    hash: '0x5960fda2d7d3451272bca059a09e6d92b796bb9f8b5cc9d2a7d39f93e0c17346',
    pair: 'XRP/TOMO',
    time: 1511091286778,
  },
]

describe('Order Domain', () => {
  it('handles initialized event properly', () => {
    const ordersDomain = getDomain([eventCreators.initialized()])
    const expected = {}

    expect(ordersDomain.byHash()).toEqual(expected)
  })

  //TODO replace with real order values or with test keys ?
  it('handles the orders updated event', () => {
    const expected = {
      '0x239c611ce10346eba1fe08dbc5542499a1e6bf5675070fa7ef809dc85d75f7c9': {
        amount: 3606.63,
        price: 53983.52,
        type: 'MO',
        side: 'SELL',
        hash: '0x239c611ce10346eba1fe08dbc5542499a1e6bf5675070fa7ef809dc85d75f7c9',
        pair: 'BTC/TOMO',
        time: 1504567900560,
      },
      '0x8c3122d67b7836f641a39e694b3b61f817ced9a9131d4287db30e1f05494f46a': {
        amount: 5765.64,
        price: 98517.23,
        type: 'MO',
        side: 'SELL',
        hash: '0x8c3122d67b7836f641a39e694b3b61f817ced9a9131d4287db30e1f05494f46a',
        pair: 'ETH/TOMO',
        time: 1506911142876,
      },
      '0x5960fda2d7d3451272bca059a09e6d92b796bb9f8b5cc9d2a7d39f93e0c17346': {
        amount: 2885.5,
        price: 23798.09,
        type: 'LI',
        side: 'SELL',
        hash: '0x5960fda2d7d3451272bca059a09e6d92b796bb9f8b5cc9d2a7d39f93e0c17346',
        pair: 'XRP/TOMO',
        time: 1511091286778,
      },
    }

    const ordersDomain = getDomain([eventCreators.initialized(), eventCreators.ordersUpdated(orders)])

    expect(ordersDomain.byHash()).toEqual(expected)
  })
})

it('handles orders removed event', () => {
  const expected = {
    '0x8c3122d67b7836f641a39e694b3b61f817ced9a9131d4287db30e1f05494f46a': {
      amount: 5765.64,
      price: 98517.23,
      type: 'MO',
      side: 'SELL',
      hash: '0x8c3122d67b7836f641a39e694b3b61f817ced9a9131d4287db30e1f05494f46a',
      pair: 'ETH/TOMO',
      time: 1506911142876,
    },
  }

  const ordersDomain = getDomain([
    eventCreators.initialized(),
    eventCreators.ordersUpdated(orders),
    eventCreators.ordersDeleted(['0x239c611ce10346eba1fe08dbc5542499a1e6bf5675070fa7ef809dc85d75f7c9', '0x5960fda2d7d3451272bca059a09e6d92b796bb9f8b5cc9d2a7d39f93e0c17346']),
  ])

  expect(ordersDomain.byHash()).toEqual(expected)
})
