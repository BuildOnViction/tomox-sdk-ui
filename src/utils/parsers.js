//@flow
import { isFloat, isInteger, round, computeChange } from './helpers'

import { utils } from 'ethers'

import {
  pricePrecision,
  amountPrecision,
  defaultDecimals,
} from '../config/tokens'

import type { TokenPair, TokenPairData, Token, Tokens } from '../types/tokens'
import type { AddressAssociationPayload } from '../types/deposit'
import type { Order, Orders } from '../types/orders'
import type { Trade, Trades } from '../types/trades'
import type { APIPairData } from '../types/api'

export const parseJSONData = (obj: Object): Object => {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      parseJSONData(obj[key])
    } else if (typeof obj[key] === typeof []) {
      obj[key].forEach(elem => parseJSONData(elem))
    } else if (typeof obj[key] === 'string') {
      if (isFloat(obj[key])) {
        obj[key] = parseFloat(obj[key])
      } else if (isInteger(obj[key])) {
        obj[key] = parseInt(obj[key], 10)
      }
    }
  }

  return obj
}

export const parseJSONToFixed = (obj: Object, decimals: number = 2): Object => {
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      parseJSONToFixed(obj[key], decimals)
    } else if (typeof obj[key] === typeof []) {
      obj[key].forEach(elem => parseJSONToFixed(elem, decimals))
    } else if (typeof obj[key] === 'string') {
      if (isFloat(obj[key])) {
        obj[key] = round(obj[key], decimals)
      } else if (isInteger(obj[key])) {
        obj[key] = round(obj[key], decimals)
      }
    } else if (typeof obj[key] === 'number') {
      obj[key] = round(obj[key], decimals)
    }
  }

  return obj
}

export const parseAddressAssociation = (
  payload: ?Object
): ?AddressAssociationPayload => {
  if (!payload) {
    return null
  }
  const { chain, ...addressAssociation } = payload
  return { chain, addressAssociation }
}

export const parseToken = (token: Object): Token => ({
  address: token.contractAddress,
  decimals: token.decimals,
  symbol: token.symbol,
  image: token.image,
})

export const parseTokens = (tokens: Array<Object>): Tokens => {
  const parsed = tokens.map(parseToken)

  return parsed
}

/**
 * Parse amount
 *
 * @param amount
 * @param pair
 * @param precision
 * @returns {number}
 */
export const parseTokenAmount = (amount: string, pair: TokenPair, precision: number = 2) => {
  const { baseTokenDecimals } = pair
  const precisionMultiplier = utils.bigNumberify(10).pow(precision)
  const baseMultiplier = utils.bigNumberify(10).pow(baseTokenDecimals)
  const bigAmount = utils.bigNumberify(amount).mul(precisionMultiplier).div(baseMultiplier)

  return Number(bigAmount) / Number(precisionMultiplier)
}

/**
 * Parse price
 *
 * @param pricepoint
 * @param pair
 * @param precision
 * @returns {number}
 */
export const parsePricepoint = (pricepoint: string, pair: TokenPair, precision: number = 6) => {
  const { quoteTokenDecimals } = pair
  const priceMultiplier = utils.bigNumberify(10).pow(18)
  const quoteMultiplier = utils.bigNumberify(10).pow(quoteTokenDecimals)
  const bigPricepoint = utils.bigNumberify(pricepoint)

  return (Number(bigPricepoint.div(priceMultiplier).toString()) / Number(quoteMultiplier.toString()))
}

export const parseOrder = (
  order: Object,
  tokenDecimals: number = defaultDecimals,
  precision: number = amountPrecision
): Order => ({
  time: order.createdAt,
  amount: parseTokenAmount(order.amount, tokenDecimals, precision),
  filled: parseTokenAmount(order.filledAmount, tokenDecimals, precision),
  price: parsePricepoint(order.pricepoint),
  hash: order.hash,
  side: order.side,
  pair: order.pairName,
  type: 'LIMIT',
  status: order.status,
  cancellable: order.cancellable,
})

export const parseOrders = (
  orders: Array<Object>,
  tokenDecimals: number = defaultDecimals,
  precision: number = amountPrecision
): Orders => {
  const parsed = orders.map(order =>
    parseOrder(order, tokenDecimals, precision)
  )

  return parsed
}

export const parseTrade = (
  trade: Object,
  tokenDecimals: number = defaultDecimals,
  precision: number = amountPrecision
): Trade => ({
  time: trade.createdAt,
  price: parsePricepoint(trade.pricepoint),
  amount: parseTokenAmount(trade.amount, tokenDecimals, precision),
  hash: trade.hash,
  orderHash: trade.orderHash,
  type: trade.type || 'LIMIT',
  side: trade.side,
  pair: trade.pairName,
  status: trade.status === 'SUCCESS' ? 'EXECUTED' : trade.status,
  maker: utils.getAddress(trade.maker),
  taker: utils.getAddress(trade.taker),
  signature: trade.signature,
  tradeNonce: trade.tradeNonce,
})

export const parseTrades = (
  trades: Array<Object>,
  tokenDecimals: number = defaultDecimals,
  precision: number = amountPrecision
): Trades => {
  const parsed = trades.map(trade =>
    parseTrade(trade, tokenDecimals, precision)
  )

  return parsed
}

export const parseOrderBookData = (
  data: Object,
  tokenDecimals: number = defaultDecimals,
  precision: number = amountPrecision
): Object => {
  let { bids, asks } = data

  asks = asks.map(ask => ({
    price: parsePricepoint(ask.pricepoint),
    amount: parseTokenAmount(ask.amount, tokenDecimals, precision),
  }))

  bids = bids.map(bid => ({
    price: parsePricepoint(bid.pricepoint),
    amount: parseTokenAmount(bid.amount, tokenDecimals, precision),
  }))

  return {
    asks,
    bids,
  }
}

export const parseTokenPairData = (
  data: Array<Object>,
  tokenDecimals: number = defaultDecimals
): Array<TokenPairData> => {
  const parsed = data.map(datum => ({
    base: null,
    quote: null,
    favorited: null,
    pair: datum.pair.pairName,
    lastPrice: datum.close ? parsePricepoint(datum.close) : null,
    change: datum.open
      ? round((datum.close - datum.open) / datum.open, 1)
      : null,
    high: datum.high ? parsePricepoint(datum.high) : null,
    low: datum.low ? parsePricepoint(datum.low) : null,
    volume: datum.volume
      ? parseTokenAmount(datum.volume, tokenDecimals, 0)
      : null,
  }))

  return parsed
}

export const parseTokenPairsData = (data: APIPairData, pairs: Object) => {

  const result = []

  data.forEach(datum => {
    const pair = pairs[datum.pair.pairName]

    if (pair) {
      result.push({
        pair: pair.pair,
        price: datum.price ? parsePricepoint(datum.price, pair) : null,
        lastPrice: datum.close ? parsePricepoint(datum.close, pair) : null,
        change: datum.open ? computeChange(datum.open, datum.close) : null,
        high: datum.high ? parsePricepoint(datum.high, pair) : null,
        low: datum.low ? parsePricepoint(datum.low, pair) : null,
        volume: datum.volume ? parseTokenAmount(datum.volume, pair, 0) : null,
        orderVolume: datum.orderVolume ? parseTokenAmount(datum.orderVolume, pair, 0) : null,
        orderCount: datum.orderCount ? datum.orderCount : null,
      })
    }
  })

  return result
}

export const parseOHLCV = (
  data: Array<Object>,
  baseTokenDecimals: number = defaultDecimals
): Array<Object> => {
  const parsed = data.map(datum => {
    return {
      date: new Date(datum.timestamp),
      open: parsePricepoint(datum.open),
      high: parsePricepoint(datum.high),
      low: parsePricepoint(datum.low),
      close: parsePricepoint(datum.close),
      volume: parseTokenAmount(datum.volume, baseTokenDecimals, 2),
    }
  })

  return parsed
}
