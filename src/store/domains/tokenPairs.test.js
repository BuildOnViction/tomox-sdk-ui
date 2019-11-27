import * as eventCreators from './tokenPairs'
import { generateTokenPairs } from '../../utils/tokens'
import getTokenPairsDomain from './tokenPairs'
import { quoteTokens } from '../../config/quotes'

//createInitialState is not an eventCreator. We simply import it in order to create a new
//create an initial state. The default initial state used in the application has to many
//tokens to be used for tests. Therefore we recreate an initial state with less tokens
//to test the token pair model
// const symbols = ['TOMO', 'EOS', 'WETH', 'ZRX']

const tokensBySymbol = {
  TOMO: { symbol: 'TOMO', address: '0x0000000000000000000000000000000000000001' },
  EOS: { symbol: 'EOS', address: '0x8d0a722b76c0dcb91bf62334afd11f925c0adb95' },
  WETH: { symbol: 'WETH', address: '0x549638ff7b1038a1923f8e2c38b8c6fc50b8acb6' },
  ZRX: { symbol: 'ZRX', address: '0xc73eec564e96e6653943d6d0e32121d455917653' },
}

const tokens = Object.values(tokensBySymbol)
const defaultPairs = generateTokenPairs(quoteTokens, tokens)

const initialTokenPairState = {
  byPair: defaultPairs,
  data: {},
  favorites: [],
  currentPair: Object.values(defaultPairs)[0].pair,
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
    const expectedPairs = ['EOS/TOMO', 'WETH/TOMO', 'ZRX/TOMO']

    const expectedByPairsByCode = {
      "EOS/TOMO": {
        "baseTokenAddress": "0x8d0a722b76c0dcb91bf62334afd11f925c0adb95",
        "baseTokenDecimals": undefined,
        "baseTokenSymbol": "EOS",
        "pair": "EOS/TOMO",
        "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
        "quoteTokenDecimals": 18,
        "quoteTokenSymbol": "TOMO",
      },
      "WETH/TOMO": {
        "baseTokenAddress": "0x549638ff7b1038a1923f8e2c38b8c6fc50b8acb6",
        "baseTokenDecimals": undefined,
        "baseTokenSymbol": "WETH",
        "pair": "WETH/TOMO",
        "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
        "quoteTokenDecimals": 18,
        "quoteTokenSymbol": "TOMO",
      },
      "ZRX/TOMO": {
        "baseTokenAddress": "0xc73eec564e96e6653943d6d0e32121d455917653",
        "baseTokenDecimals": undefined,
        "baseTokenSymbol": "ZRX",
        "pair": "ZRX/TOMO",
        "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
        "quoteTokenDecimals": 18,
        "quoteTokenSymbol": "TOMO",
      },
    }
    expect(tokenPairsDomain.getPairs()).toEqual(expectedPairs)
    expect(tokenPairsDomain.getPairsByCode()).toEqual(expectedByPairsByCode)
  })

  it('handles tokenPairUpdated event properly', () => {
    const pair = {
      "baseTokenAddress": "0x8f8221afbb33998d8584a2b05749ba73c37a938a",
      "baseTokenDecimals": undefined,
      "baseTokenSymbol": "REQ",
      "pair": "REQ/TOMO",
      "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
      "quoteTokenDecimals": 18,
      "quoteTokenSymbol": "TOMO",
      "active": true,
      "rank": 0,
    }

    const tokenPairsDomain = getDomain([
      eventCreators.initialized(initialTokenPairState),
      eventCreators.tokenPairsUpdated([pair]),
    ])

    const expectedPairs = ['EOS/TOMO', 'WETH/TOMO', 'ZRX/TOMO', 'REQ/TOMO']

    const expectedByPairsByCode = {
      "EOS/TOMO": {
        "baseTokenAddress": "0x8d0a722b76c0dcb91bf62334afd11f925c0adb95",
        "baseTokenDecimals": undefined,
        "baseTokenSymbol": "EOS",
        "pair": "EOS/TOMO",
        "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
        "quoteTokenDecimals": 18,
        "quoteTokenSymbol": "TOMO",
      },
      "WETH/TOMO": {
        "baseTokenAddress": "0x549638ff7b1038a1923f8e2c38b8c6fc50b8acb6",
        "baseTokenDecimals": undefined,
        "baseTokenSymbol": "WETH",
        "pair": "WETH/TOMO",
        "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
        "quoteTokenDecimals": 18,
        "quoteTokenSymbol": "TOMO",
      },
      "ZRX/TOMO": {
        "baseTokenAddress": "0xc73eec564e96e6653943d6d0e32121d455917653",
        "baseTokenDecimals": undefined,
        "baseTokenSymbol": "ZRX",
        "pair": "ZRX/TOMO",
        "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
        "quoteTokenDecimals": 18,
        "quoteTokenSymbol": "TOMO",
      },
      "REQ/TOMO": {
        "baseTokenAddress": "0x8f8221afbb33998d8584a2b05749ba73c37a938a",
        "baseTokenDecimals": undefined,
        "baseTokenSymbol": "REQ",
        "pair": "REQ/TOMO",
        "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
        "quoteTokenDecimals": 18,
        "quoteTokenSymbol": "TOMO",
        "active": true,
        "rank": 0,
      },
    }

    expect(tokenPairsDomain.getPairs()).toEqual(expectedPairs)
    expect(tokenPairsDomain.getPairsByCode()).toEqual(expectedByPairsByCode)
  })

  it('handles tokenPairUpdated event properly if the event is already pair', () => {
    const pair = {
      "baseTokenAddress": "0x8d0a722b76c0dcb91bf62334afd11f925c0adb95",
      "baseTokenDecimals": undefined,
      "baseTokenSymbol": "EOS",
      "pair": "EOS/TOMO",
      "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
      "quoteTokenDecimals": 18,
      "quoteTokenSymbol": "TOMO",
    }

    const tokenPairsDomain = getDomain([
      eventCreators.initialized(initialTokenPairState),
      eventCreators.tokenPairsUpdated([pair]),
    ])

    const expectedPairs = ['EOS/TOMO', 'WETH/TOMO', 'ZRX/TOMO']

    const expectedByPairsByCode = {
      "EOS/TOMO": {
        "baseTokenAddress": "0x8d0a722b76c0dcb91bf62334afd11f925c0adb95",
        "baseTokenDecimals": undefined,
        "baseTokenSymbol": "EOS",
        "pair": "EOS/TOMO",
        "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
        "quoteTokenDecimals": 18,
        "quoteTokenSymbol": "TOMO",
      },
      "WETH/TOMO": {
        "baseTokenAddress": "0x549638ff7b1038a1923f8e2c38b8c6fc50b8acb6",
        "baseTokenDecimals": undefined,
        "baseTokenSymbol": "WETH",
        "pair": "WETH/TOMO",
        "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
        "quoteTokenDecimals": 18,
        "quoteTokenSymbol": "TOMO",
      },
      "ZRX/TOMO": {
        "baseTokenAddress": "0xc73eec564e96e6653943d6d0e32121d455917653",
        "baseTokenDecimals": undefined,
        "baseTokenSymbol": "ZRX",
        "pair": "ZRX/TOMO",
        "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
        "quoteTokenDecimals": 18,
        "quoteTokenSymbol": "TOMO",
      },
    }

    expect(tokenPairsDomain.getPairs()).toEqual(expectedPairs)
    expect(tokenPairsDomain.getPairsByCode()).toEqual(expectedByPairsByCode)
  })

  it('handles tokenPairUpdated event properly', () => {
    const pair1 = {
      "baseTokenAddress": "0x8f8221afbb33998d8584a2b05749ba73c37a938a",
      "baseTokenDecimals": undefined,
      "baseTokenSymbol": "REQ",
      "pair": "REQ/TOMO",
      "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
      "quoteTokenDecimals": 18,
      "quoteTokenSymbol": "TOMO",
      "active": true,
      "rank": 0,
    }

    const pair2 = {
      "baseTokenAddress": "0x8d0a722b76c0dcb91bf62334afd11f925c0adb95",
      "baseTokenDecimals": undefined,
      "baseTokenSymbol": "EOS",
      "pair": "EOS/TOMO",
      "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
      "quoteTokenDecimals": 18,
      "quoteTokenSymbol": "TOMO",
    }

    const tokenPairsDomain = getDomain([
      eventCreators.initialized(initialTokenPairState),
      eventCreators.tokenPairsUpdated([pair1]),
      eventCreators.tokenPairRemoved(pair2),
    ])

    const expectedPairs = ['WETH/TOMO', 'ZRX/TOMO', 'REQ/TOMO']

    const expectedPairsBySymbol = {
      "WETH/TOMO": {
        "baseTokenAddress": "0x549638ff7b1038a1923f8e2c38b8c6fc50b8acb6",
        "baseTokenDecimals": undefined,
        "baseTokenSymbol": "WETH",
        "pair": "WETH/TOMO",
        "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
        "quoteTokenDecimals": 18,
        "quoteTokenSymbol": "TOMO",
      },
      "ZRX/TOMO": {
        "baseTokenAddress": "0xc73eec564e96e6653943d6d0e32121d455917653",
        "baseTokenDecimals": undefined,
        "baseTokenSymbol": "ZRX",
        "pair": "ZRX/TOMO",
        "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
        "quoteTokenDecimals": 18,
        "quoteTokenSymbol": "TOMO",
      },
      "REQ/TOMO": {
        "baseTokenAddress": "0x8f8221afbb33998d8584a2b05749ba73c37a938a",
        "baseTokenDecimals": undefined,
        "baseTokenSymbol": "REQ",
        "pair": "REQ/TOMO",
        "quoteTokenAddress": "0x0000000000000000000000000000000000000001",
        "quoteTokenDecimals": 18,
        "quoteTokenSymbol": "TOMO",
        "active": true,
        "rank": 0,
      },
    }

    expect(tokenPairsDomain.getPairs()).toEqual(expectedPairs)
    expect(tokenPairsDomain.getPairsByCode()).toEqual(expectedPairsBySymbol)
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
