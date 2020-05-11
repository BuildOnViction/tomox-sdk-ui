import tokenSearcherSelector from './tokenSearcher'
import * as domains from '../domains'

jest.mock('../domains')

it.skip('tokenSearcherSelector parses data correctly', () => {
  const getFavoritePairsMock = jest.fn(() => ['TOMO/DAI', 'ZRX/WETH'])

  const getCurrentPairMock = jest.fn(() => ({
    pair: 'BTC/TOMO',
    baseTokenSymbol: 'BTC',
    quoteTokenSymbol: 'TOMO',
  }))

  const tokenBalanceMock = jest.fn(symbol => {
    if (symbol === 'BTC') return '100.00'
    if (symbol === 'TOMO') return '10.00'
    return
  })

  const getTokenPairsDataArrayMock = jest.fn(() => [
    {
      pair: 'BTC/TOMO',
      lastPrice: '7425.2945',
      change: '4.5421',
      high: '8782.7964',
      low: '6499.3696',
      volume: 720404,
    },
    {
      pair: 'DAI/TOMO',
      lastPrice: '6018.7886',
      change: '1.6589',
      high: '3876.8717',
      low: '4613.5315',
      volume: 68946,
    },
  ])

  const expectedTokenPairsByQuoteToken = {
    "TOMO": [
      {
        "base": "BTC",
        "change": "4.5421",
        "favorited": false,
        "high": "8782.7964",
        "lastPrice": "7425.2945",
        "low": "6499.3696",
        "pair": "BTC/TOMO",
        "quote": "TOMO",
        "volume": 720404,
      },
      {
        "base": "DAI",
        "change": "1.6589",
        "favorited": false,
        "high": "3876.8717",
        "lastPrice": "6018.7886",
        "low": "4613.5315",
        "pair": "DAI/TOMO",
        "quote": "TOMO",
        "volume": 68946,
      },
    ],
  }

  domains.getTokenPairsDomain = jest.fn(() => ({
    getTokenPairsDataArray: getTokenPairsDataArrayMock,
    getFavoritePairs: getFavoritePairsMock,
    getCurrentPair: getCurrentPairMock,
  }))

  domains.getAccountBalancesDomain = jest.fn(() => ({
    tokenBalance: tokenBalanceMock,
  }))

  const { tokenPairsByQuoteToken, currentPair, baseTokenBalance, quoteTokenBalance } = tokenSearcherSelector()
  expect(tokenPairsByQuoteToken).toEqual(expectedTokenPairsByQuoteToken)
  expect(currentPair).toEqual({
    baseTokenSymbol: "BTC", 
    pair: "BTC/TOMO", 
    quoteTokenSymbol: "TOMO",
  })
  expect(baseTokenBalance).toEqual('100.00')
  expect(quoteTokenBalance).toEqual('10.00')
})
