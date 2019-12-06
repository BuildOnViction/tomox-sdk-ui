import domain from './orderBook'
import * as eventCreators from './orderBook'

function getDomain(events) {
  const state = events.reduce((state, event) => event(state), undefined)
  return domain(state)
}

it('handles initialized event properly', () => {
  const domain = getDomain([eventCreators.initialized()])

  expect(domain.getState()).toEqual({
    selected: null,
    bids: {},
    asks: {},
    sortedBids: [],
    sortedAsks: [],
    quoteToken: '',
    baseToken: '',
  })

  expect(domain.getAsks()).toEqual({})
  expect(domain.getBids()).toEqual({})
  expect(domain.getOrderedBids()).toEqual([])
  expect(domain.getOrderedAsks()).toEqual([])
  expect(domain.getQuoteToken()).toEqual('')
  expect(domain.getBaseToken()).toEqual('')
})

it('handles handles updated event properly', () => {
  const bids = [
    {
      price: 409.039,
      amount: 17,
    },
    {
      price: 407.5885,
      amount: 69,
    },
    {
      price: 414.3982,
      amount: 76.85,
    },
    {
      price: 414.2421,
      amount: 80,
    },
    {
      price: 411.7926,
      amount: 64,
    },
  ]

  const asks = [
    {
      price: 400.1586,
      amount: 21,
    },
    {
      price: 418.1707,
      amount: 52,
    },
    {
      price: 402.2414,
      amount: 79,
    },
    {
      price: 417.5532,
      amount: 16,
    },
    {
      price: 403.755,
      amount: 43,
    },
    {
      price: 403.3452,
      amount: 45,
    },
  ]

  const domain = getDomain([eventCreators.initialized(), eventCreators.orderBookUpdated(bids, asks)])

  expect(domain.getState()).toEqual({
    "asks": {
      "400.1586": {
        "amount": 21,
        "price": 400.1586,
        "update": true,
      },
      "402.2414": {
        "amount": 79,
        "price": 402.2414,
        "update": true,
      },
      "403.3452": {
        "amount": 45,
        "price": 403.3452,
        "update": true,
      },
      "403.755": {
        "amount": 43,
        "price": 403.755,
        "update": true,
      },
      "417.5532": {
        "amount": 16,
        "price": 417.5532,
        "update": true,
      },
      "418.1707": {
        "amount": 52,
        "price": 418.1707,
        "update": true,
      },
    },
    "baseToken": "",
    "bids": {
      "407.5885": {
        "amount": 69,
        "price": 407.5885,
        "update": true,
      },
      "409.039": {
        "amount": 17,
        "price": 409.039,
        "update": true,
      },
      "411.7926": {
        "amount": 64,
        "price": 411.7926,
        "update": true,
      },
      "414.2421": {
        "amount": 80,
        "price": 414.2421,
        "update": true,
      },
      "414.3982": {
        "amount": 76.85,
        "price": 414.3982,
        "update": true,
      },
    },
    "quoteToken": "",
    "selected": null,
    "sortedAsks": [
      400.1586,
      402.2414,
      403.3452,
      403.755,
      417.5532,
      418.1707,
    ],
    "sortedBids": [
      414.3982,
      414.2421,
      411.7926,
      409.039,
      407.5885,
    ],
  })

  expect(domain.getOrderBookData()).toEqual({
    "asks": [
      {
        "amount": "21.00000000",
        "price": "400.15860000",
        "relativeTotal": 0.08203125,
        "total": "21.00000000",
        "update": true,
      },
      {
        "amount": "79.00000000",
        "price": "402.24140000",
        "relativeTotal": 0.30859375,
        "total": "100.00000000",
        "update": true,
      },
      {
        "amount": "45.00000000",
        "price": "403.34520000",
        "relativeTotal": 0.17578125,
        "total": "145.00000000",
        "update": true,
      },
      {
        "amount": "43.00000000",
        "price": "403.75500000",
        "relativeTotal": 0.16796875,
        "total": "188.00000000",
        "update": true,
      },
      {
        "amount": "16.00000000",
        "price": "417.55320000",
        "relativeTotal": 0.0625,
        "total": "204.00000000",
        "update": true,
      },
      {
        "amount": "52.00000000",
        "price": "418.17070000",
        "relativeTotal": 0.203125,
        "total": "256.00000000",
        "update": true,
      }
    ],
    "bids": [
      {
        "amount": "76.85000000",
        "price": "414.39820000",
        "relativeTotal": 0.2504481016783444,
        "total": "76.85000000",
        "update": true,
      },
      {
        "amount": "80.00000000",
        "price": "414.24210000",
        "relativeTotal": 0.26071370376405406,
        "total": "156.85000000",
        "update": true,
      },
      {
        "amount": "64.00000000",
        "price": "411.79260000",
        "relativeTotal": 0.20857096301124325,
        "total": "220.85000000",
        "update": true,
      },
      {
        "amount": "17.00000000",
        "price": "409.03900000",
        "relativeTotal": 0.055401662049861494,
        "total": "237.85000000",
        "update": true,
      },
      {
        "amount": "69.00000000",
        "price": "407.58850000",
        "relativeTotal": 0.22486556949649664,
        "total": "306.85000000",
        "update": true,
      },
    ],
  })
})
