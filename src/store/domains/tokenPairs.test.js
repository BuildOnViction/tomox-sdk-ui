import * as eventCreators from './tokenPairs'
// import { generateTokenPairs } from '../../utils/tokens'
import getTokenPairsDomain from './tokenPairs'
// import { quoteTokens } from '../../config/quotes'

//createInitialState is not an eventCreator. We simply import it in order to create a new
//create an initial state. The default initial state used in the application has to many
//tokens to be used for tests. Therefore we recreate an initial state with less tokens
//to test the token pair model
// const symbols = ['TOMO', 'EOS', 'WETH', 'ZRX']

// const tokensBySymbol = {
//   TOMO: { symbol: 'TOMO', address: '0x0000000000000000000000000000000000000001' },
//   EOS: { symbol: 'EOS', address: '0x8d0a722b76c0dcb91bf62334afd11f925c0adb95' },
//   WETH: { symbol: 'WETH', address: '0x549638ff7b1038a1923f8e2c38b8c6fc50b8acb6' },
//   ZRX: { symbol: 'ZRX', address: '0xc73eec564e96e6653943d6d0e32121d455917653' },
// }

// const tokens = Object.values(tokensBySymbol)
// const defaultPairs = generateTokenPairs(quoteTokens, tokens)

const addresses = {
  "tokens": {
    "0x0000000000000000000000000000000000000001": {
      "name": "TOMO",
      "symbol": "TOMO",
      "decimals": 18,
      "verified": false,
      "address": "0x0000000000000000000000000000000000000001",
    },
    "0xaad540ac542c3688652a3fc7b8e21b3fc1d097e9": {
      "name": "ETH",
      "symbol": "ETH",
      "decimals": 18,
      "verified": true,
      "address": "0xaad540ac542c3688652a3fc7b8e21b3fc1d097e9",
    },
    "0x576201ac3f1e0fe483a9320dacc4b08eb3e58306": {
      "name": "ADA",
      "symbol": "ADA",
      "decimals": 0,
      "verified": false,
      "address": "0x576201ac3f1e0fe483a9320dacc4b08eb3e58306",
    },
    "0xfdf68de6dffd893221fc9f7985febc2ab20761a6": {
      "name": "BCH",
      "symbol": "BCH",
      "decimals": 18,
      "verified": false,
      "address": "0xfdf68de6dffd893221fc9f7985febc2ab20761a6",
    },
    "0xd9bb01454c85247b2ef35bb5be57384cc275a8cf": {
      "name": "EOS",
      "symbol": "EOS",
      "decimals": 18,
      "verified": false,
      "address": "0xd9bb01454c85247b2ef35bb5be57384cc275a8cf",
    },
    "0xc2fa1ba90b15e3612e0067a0020192938784d9c5": {
      "name": "BTC",
      "symbol": "BTC",
      "decimals": 8,
      "verified": true,
      "address": "0xc2fa1ba90b15e3612e0067a0020192938784d9c5",
    },
    "0x45c25041b8e6cbd5c963e7943007187c3673c7c9": {
      "name": "USDT",
      "symbol": "USDT",
      "decimals": 6,
      "verified": true,
      "address": "0x45c25041b8e6cbd5c963e7943007187c3673c7c9",
    },
    "0x6f98655a8fa7aeef3147ee002c666d09c7aa4f5c": {
      "name": "LTC",
      "symbol": "LTC",
      "decimals": 18,
      "verified": false,
      "address": "0x6f98655a8fa7aeef3147ee002c666d09c7aa4f5c",
    },
    "0xac389aca56394a5b14918cf6437600760b6c650c": {
      "name": "BNB",
      "symbol": "BNB",
      "decimals": 18,
      "verified": false,
      "address": "0xac389aca56394a5b14918cf6437600760b6c650c",
    },
    "0xf992cf45394dac5f50a26446de17803a79b940da": {
      "name": "ETC",
      "symbol": "ETC",
      "decimals": 18,
      "verified": false,
      "address": "0xf992cf45394dac5f50a26446de17803a79b940da",
    },
    "0x5dc27d59bb80e0ef853bb2e27b94113df08f547f": {
      "name": "XRP",
      "symbol": "XRP",
      "decimals": 18,
      "verified": false,
      "address": "0x5dc27d59bb80e0ef853bb2e27b94113df08f547f",
    },
  },
  "pairs": {
    "TOMO/BTC": {
      "active": true,
      "baseTokenAddress": "0x0000000000000000000000000000000000000001",
      "baseTokenDecimals": 18,
      "baseTokenSymbol": "TOMO",
      "listed": false,
      "makeFee": "10",
      "quoteTokenAddress": "0xc2fa1ba90b15e3612e0067a0020192938784d9c5",
      "quoteTokenDecimals": 8,
      "quoteTokenSymbol": "BTC",
      "rank": 0,
      "relayerAddress": "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
      "takeFee": "10",
      "pair": "TOMO/BTC",
    },
    "TOMO/USDT": {
      "active": true,
      "baseTokenAddress": "0x0000000000000000000000000000000000000001",
      "baseTokenDecimals": 18,
      "baseTokenSymbol": "TOMO",
      "listed": false,
      "makeFee": "10",
      "quoteTokenAddress": "0x45c25041b8e6cbd5c963e7943007187c3673c7c9",
      "quoteTokenDecimals": 6,
      "quoteTokenSymbol": "USDT",
      "rank": 0,
      "relayerAddress": "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
      "takeFee": "10",
      "pair": "TOMO/USDT",
    },
    "ETH/TOMO": {
      "active": true,
      "baseTokenAddress": "0xaad540ac542c3688652a3fc7b8e21b3fc1d097e9",
      "baseTokenDecimals": 18,
      "baseTokenSymbol": "ETH",
      "listed": false,
      "makeFee": "10",
      "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
      "quoteTokenDecimals": 18,
      "quoteTokenSymbol": "TOMO",
      "rank": 0,
      "relayerAddress": "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
      "takeFee": "10",
      "pair": "ETH/TOMO",
    },
    "XRP/TOMO": {
      "active": true,
      "baseTokenAddress": "0x5dc27d59bb80e0ef853bb2e27b94113df08f547f",
      "baseTokenDecimals": 18,
      "baseTokenSymbol": "XRP",
      "listed": false,
      "makeFee": "10",
      "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
      "quoteTokenDecimals": 18,
      "quoteTokenSymbol": "TOMO",
      "rank": 0,
      "relayerAddress": "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
      "takeFee": "10",
      "pair": "XRP/TOMO",
    },
    "LTC/TOMO": {
      "active": true,
      "baseTokenAddress": "0x6f98655a8fa7aeef3147ee002c666d09c7aa4f5c",
      "baseTokenDecimals": 18,
      "baseTokenSymbol": "LTC",
      "listed": false,
      "makeFee": "10",
      "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
      "quoteTokenDecimals": 18,
      "quoteTokenSymbol": "TOMO",
      "rank": 0,
      "relayerAddress": "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
      "takeFee": "10",
      "pair": "LTC/TOMO",
    },
    "BNB/TOMO": {
      "active": true,
      "baseTokenAddress": "0xac389aca56394a5b14918cf6437600760b6c650c",
      "baseTokenDecimals": 18,
      "baseTokenSymbol": "BNB",
      "listed": false,
      "makeFee": "10",
      "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
      "quoteTokenDecimals": 18,
      "quoteTokenSymbol": "TOMO",
      "rank": 0,
      "relayerAddress": "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
      "takeFee": "10",
      "pair": "BNB/TOMO",
    },
    "ADA/TOMO": {
      "active": true,
      "baseTokenAddress": "0x576201ac3f1e0fe483a9320dacc4b08eb3e58306",
      "baseTokenDecimals": 0,
      "baseTokenSymbol": "ADA",
      "listed": false,
      "makeFee": "10",
      "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
      "quoteTokenDecimals": 18,
      "quoteTokenSymbol": "TOMO",
      "rank": 0,
      "relayerAddress": "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
      "takeFee": "10",
      "pair": "ADA/TOMO",
    },
    "ETC/TOMO": {
      "active": true,
      "baseTokenAddress": "0xf992cf45394dac5f50a26446de17803a79b940da",
      "baseTokenDecimals": 18,
      "baseTokenSymbol": "ETC",
      "listed": false,
      "makeFee": "10",
      "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
      "quoteTokenDecimals": 18,
      "quoteTokenSymbol": "TOMO",
      "rank": 0,
      "relayerAddress": "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
      "takeFee": "10",
      "pair": "ETC/TOMO",
    },
    "BCH/TOMO": {
      "active": true,
      "baseTokenAddress": "0xfdf68de6dffd893221fc9f7985febc2ab20761a6",
      "baseTokenDecimals": 18,
      "baseTokenSymbol": "BCH",
      "listed": false,
      "makeFee": "10",
      "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
      "quoteTokenDecimals": 18,
      "quoteTokenSymbol": "TOMO",
      "rank": 0,
      "relayerAddress": "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
      "takeFee": "10",
      "pair": "BCH/TOMO",
    },
    "EOS/TOMO": {
      "active": true,
      "baseTokenAddress": "0xd9bb01454c85247b2ef35bb5be57384cc275a8cf",
      "baseTokenDecimals": 18,
      "baseTokenSymbol": "EOS",
      "listed": false,
      "makeFee": "10",
      "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
      "quoteTokenDecimals": 18,
      "quoteTokenSymbol": "TOMO",
      "rank": 0,
      "relayerAddress": "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
      "takeFee": "10",
      "pair": "EOS/TOMO",
    },
    "ETH/BTC": {
      "active": true,
      "baseTokenAddress": "0xaad540ac542c3688652a3fc7b8e21b3fc1d097e9",
      "baseTokenDecimals": 18,
      "baseTokenSymbol": "ETH",
      "listed": false,
      "makeFee": "10",
      "quoteTokenAddress": "0xc2fa1ba90b15e3612e0067a0020192938784d9c5",
      "quoteTokenDecimals": 8,
      "quoteTokenSymbol": "BTC",
      "rank": 0,
      "relayerAddress": "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
      "takeFee": "10",
      "pair": "ETH/BTC",
    },
    "XRP/BTC": {
      "active": true,
      "baseTokenAddress": "0x5dc27d59bb80e0ef853bb2e27b94113df08f547f",
      "baseTokenDecimals": 18,
      "baseTokenSymbol": "XRP",
      "listed": false,
      "makeFee": "10",
      "quoteTokenAddress": "0xc2fa1ba90b15e3612e0067a0020192938784d9c5",
      "quoteTokenDecimals": 8,
      "quoteTokenSymbol": "BTC",
      "rank": 0,
      "relayerAddress": "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
      "takeFee": "10",
      "pair": "XRP/BTC",
    },
    "BTC/USDT": {
      "active": true,
      "baseTokenAddress": "0xc2fa1ba90b15e3612e0067a0020192938784d9c5",
      "baseTokenDecimals": 8,
      "baseTokenSymbol": "BTC",
      "listed": false,
      "makeFee": "10",
      "quoteTokenAddress": "0x45c25041b8e6cbd5c963e7943007187c3673c7c9",
      "quoteTokenDecimals": 6,
      "quoteTokenSymbol": "USDT",
      "rank": 0,
      "relayerAddress": "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
      "takeFee": "10",
      "pair": "BTC/USDT",
    },
  },
}

const defaultTokenPairs = addresses ? addresses.pairs : {}
const defaultTokenPair = Object.values(defaultTokenPairs)

const initialTokenPairState = {
  byPair: defaultTokenPairs,
  data: {},
  favorites: [],
  currentPair: defaultTokenPair || {},
  currentPairData: null,
  sortedPairs: [],
  smallChartsData: null,
  loading: false,
}

function getDomain(events) {
  const state = events.reduce((state, event) => event(state), undefined)
  return getTokenPairsDomain(state)
}

describe('Token Pair Domain', () => {
  it('handles initialized event properly', () => {
    const tokenPairsDomain = getDomain([eventCreators.initialized(initialTokenPairState)])
    const expectedPairs = Object.keys(addresses.pairs)
    const expectedByPairsByCode = addresses.pairs

    expect(tokenPairsDomain.getPairs()).toEqual(expectedPairs)
    expect(tokenPairsDomain.getPairsByCode()).toEqual(expectedByPairsByCode)
  })

  it('handles tokenPairUpdated event properly', () => {
    const pair = {
      "active": true,
      "baseTokenAddress": "0xaad540ac542c3688652a3fc7b8e21b3fc1d097e9",
      "baseTokenDecimals": 18,
      "baseTokenSymbol": "ETH",
      "listed": false,
      "makeFee": "10",
      "quoteTokenAddress": "0x45c25041b8e6cbd5c963e7943007187c3673c7c9",
      "quoteTokenDecimals": 6,
      "quoteTokenSymbol": "USDT",
      "rank": 0,
      "relayerAddress": "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
      "takeFee": "10",
      "pair": "ETH/USDT",
    }

    const newPair = {
      "ETH/USDT": {
        ...pair,
      },
    }

    const tokenPairsDomain = getDomain([
      eventCreators.initialized(initialTokenPairState),
      eventCreators.tokenPairsUpdated([pair]),
    ])

    const expectedPairs = [...Object.keys(addresses.pairs), pair.pair]
    const expectedByPairsByCode = {...addresses.pairs, ...newPair}

    expect(tokenPairsDomain.getPairs()).toEqual(expectedPairs)
    expect(tokenPairsDomain.getPairsByCode()).toEqual(expectedByPairsByCode)
  })

  it('handles tokenPairUpdated event properly if the event is already pair', () => {
    const pair = {
      "active": true,
      "baseTokenAddress": "0xc2fa1ba90b15e3612e0067a0020192938784d9c5",
      "baseTokenDecimals": 8,
      "baseTokenSymbol": "BTC",
      "listed": false,
      "makeFee": "10",
      "quoteTokenAddress": "0x45c25041b8e6cbd5c963e7943007187c3673c7c9",
      "quoteTokenDecimals": 6,
      "quoteTokenSymbol": "USDT",
      "rank": 0,
      "relayerAddress": "0x0d3ab14bbad3d99f4203bd7a11acb94882050e7e",
      "takeFee": "10",
      "pair": "BTC/USDT",
    }

    const tokenPairsDomain = getDomain([
      eventCreators.initialized(initialTokenPairState),
      eventCreators.tokenPairsUpdated([pair]),
    ])

    const expectedPairs = Object.keys(addresses.pairs)

    const expectedByPairsByCode = addresses.pairs

    expect(tokenPairsDomain.getPairs()).toEqual(expectedPairs)
    expect(tokenPairsDomain.getPairsByCode()).toEqual(expectedByPairsByCode)
  })

  it('handles updated event', () => {
    const tokenPairData = [
      {
        pair: 'TOMO/WETH',
        lastPrice: '7425.2945',
        change: '4.5421',
        high: '8782.7964',
        low: '6499.3696',
        volume: 720404,
      },
      {
        pair: 'TOMO/DAI',
        lastPrice: '6018.7886',
        change: '1.6589',
        high: '3876.8717',
        low: '4613.5315',
        volume: 68946,
      },
      {
        pair: 'OMG/WETH',
        lastPrice: '398.8988',
        change: '3.7561',
        high: '9892.7954',
        low: '6884.7173',
        volume: 155839,
      },
    ]

    const expectedTokenPairData = {
      'TOMO/WETH': {
        pair: 'TOMO/WETH',
        lastPrice: '7425.2945',
        change: '4.5421',
        high: '8782.7964',
        low: '6499.3696',
        volume: 720404,
      },
      'TOMO/DAI': {
        pair: 'TOMO/DAI',
        lastPrice: '6018.7886',
        change: '1.6589',
        high: '3876.8717',
        low: '4613.5315',
        volume: 68946,
      },
      'OMG/WETH': {
        pair: 'OMG/WETH',
        lastPrice: '398.8988',
        change: '3.7561',
        high: '9892.7954',
        low: '6884.7173',
        volume: 155839,
      },
    }

    const domain = getDomain([eventCreators.initialized(), eventCreators.tokenPairDataUpdated(tokenPairData)])

    expect(domain.getTokenPairsData()).toEqual(expectedTokenPairData)
  })

  it('handles updated event twice', () => {
    const tokenPairData = [
      {
        pair: 'TOMO/WETH',
        lastPrice: '7425.2945',
        change: '4.5421',
        high: '8782.7964',
        low: '6499.3696',
        volume: 720404,
      },
      {
        pair: 'TOMO/DAI',
        lastPrice: '6018.7886',
        change: '1.6589',
        high: '3876.8717',
        low: '4613.5315',
        volume: 68946,
      },
      {
        pair: 'OMG/WETH',
        lastPrice: '398.8988',
        change: '3.7561',
        high: '9892.7954',
        low: '6884.7173',
        volume: 155839,
      },
    ]

    const newTokenPairData = [
      {
        pair: 'OMG/DAI',
        lastPrice: '66.2789',
        change: '3.5460',
        high: '9211.5292',
        low: '4241.7509',
        volume: 912048,
      },
      {
        pair: 'ZRX/WETH',
        lastPrice: '8176.7874',
        change: '1.7811',
        high: '6165.0712',
        low: '2242.4298',
        volume: 752620,
      },
      {
        pair: 'ZRX/DAI',
        lastPrice: '7378.8467',
        change: '1.0410',
        high: '7755.4530',
        low: '2317.9722',
        volume: 786519,
      },
    ]

    const expectedTokenPairData = {
      'TOMO/WETH': {
        pair: 'TOMO/WETH',
        lastPrice: '7425.2945',
        change: '4.5421',
        high: '8782.7964',
        low: '6499.3696',
        volume: 720404,
      },
      'TOMO/DAI': {
        pair: 'TOMO/DAI',
        lastPrice: '6018.7886',
        change: '1.6589',
        high: '3876.8717',
        low: '4613.5315',
        volume: 68946,
      },
      'OMG/WETH': {
        pair: 'OMG/WETH',
        lastPrice: '398.8988',
        change: '3.7561',
        high: '9892.7954',
        low: '6884.7173',
        volume: 155839,
      },
      'OMG/DAI': {
        pair: 'OMG/DAI',
        lastPrice: '66.2789',
        change: '3.5460',
        high: '9211.5292',
        low: '4241.7509',
        volume: 912048,
      },
      'ZRX/WETH': {
        pair: 'ZRX/WETH',
        lastPrice: '8176.7874',
        change: '1.7811',
        high: '6165.0712',
        low: '2242.4298',
        volume: 752620,
      },
      'ZRX/DAI': {
        pair: 'ZRX/DAI',
        lastPrice: '7378.8467',
        change: '1.0410',
        high: '7755.4530',
        low: '2317.9722',
        volume: 786519,
      },
    }

    const domain = getDomain([
      eventCreators.initialized(),
      eventCreators.tokenPairDataUpdated(tokenPairData),
      eventCreators.tokenPairDataUpdated(newTokenPairData),
    ])

    expect(domain.getTokenPairsData()).toEqual(expectedTokenPairData)
  })

  it('handles updated event with overlapping data', () => {
    const tokenPairData = [
      {
        pair: 'TOMO/WETH',
        lastPrice: '7425.2945',
        change: '4.5421',
        high: '8782.7964',
        low: '6499.3696',
        volume: 720404,
      },
      {
        pair: 'TOMO/DAI',
        lastPrice: '6018.7886',
        change: '1.6589',
        high: '3876.8717',
        low: '4613.5315',
        volume: 68946,
      },
      {
        pair: 'OMG/WETH',
        lastPrice: '398.8988',
        change: '3.7561',
        high: '9892.7954',
        low: '6884.7173',
        volume: 155839,
      },
    ]

    const newTokenPairData = [
      {
        pair: 'OMG/DAI',
        lastPrice: '66.2789',
        change: '3.5460',
        high: '9211.5292',
        low: '4241.7509',
        volume: 912048,
      },
      {
        pair: 'ZRX/WETH',
        lastPrice: '8176.7874',
        change: '1.7811',
        high: '6165.0712',
        low: '2242.4298',
        volume: 752620,
      },
      {
        pair: 'OMG/WETH',
        lastPrice: '398.888',
        change: '3.7561',
        high: '9892.7954',
        low: '6884.7173',
        volume: 155880,
      },
    ]

    const expectedTokenPairData = {
      'TOMO/WETH': {
        pair: 'TOMO/WETH',
        lastPrice: '7425.2945',
        change: '4.5421',
        high: '8782.7964',
        low: '6499.3696',
        volume: 720404,
      },
      'TOMO/DAI': {
        pair: 'TOMO/DAI',
        lastPrice: '6018.7886',
        change: '1.6589',
        high: '3876.8717',
        low: '4613.5315',
        volume: 68946,
      },
      'OMG/DAI': {
        pair: 'OMG/DAI',
        lastPrice: '66.2789',
        change: '3.5460',
        high: '9211.5292',
        low: '4241.7509',
        volume: 912048,
      },
      'ZRX/WETH': {
        pair: 'ZRX/WETH',
        lastPrice: '8176.7874',
        change: '1.7811',
        high: '6165.0712',
        low: '2242.4298',
        volume: 752620,
      },
      'OMG/WETH': {
        pair: 'OMG/WETH',
        lastPrice: '398.888',
        change: '3.7561',
        high: '9892.7954',
        low: '6884.7173',
        volume: 155880,
      },
    }

    const domain = getDomain([
      eventCreators.initialized(),
      eventCreators.tokenPairDataUpdated(tokenPairData),
      eventCreators.tokenPairDataUpdated(newTokenPairData),
    ])

    expect(domain.getTokenPairsData()).toEqual(expectedTokenPairData)
  })

  it('handles tokenPairFavorited event', () => {
    const domain = getDomain([
      eventCreators.initialized(initialTokenPairState),
      eventCreators.tokenPairFavorited('EOS/WETH', true),
    ])

    expect(domain.getFavoritePairs()).toEqual(['EOS/WETH'])
  })

  it('handles tokenPairFavorited events', () => {
    const domain = getDomain([
      eventCreators.initialized(initialTokenPairState),
      eventCreators.tokenPairFavorited('EOS/WETH', true),
      eventCreators.tokenPairFavorited('EOS/DAI', true),
      eventCreators.tokenPairFavorited('EOS/ZRX', true),
      eventCreators.tokenPairFavorited('EOS/WETH', false),
    ])

    expect(domain.getFavoritePairs()).toEqual(['EOS/DAI', 'EOS/ZRX'])
  })
})
