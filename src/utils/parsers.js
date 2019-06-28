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
import type { OrderBookData } from '../types/orderBook'
import type { Candles } from '../types/ohlcv'
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
  payload: ?Object,
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
export const parseTokenAmount = (amount: string, pair: TokenPair, precision: number = amountPrecision) => {
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
export const parsePricepoint = (pricepoint: string, pair: TokenPair, precision: number = pricePrecision) => {
  const { quoteTokenDecimals } = pair
  const priceMultiplier = utils.bigNumberify(10).pow(18)
  const quoteMultiplier = utils.bigNumberify(10).pow(quoteTokenDecimals)
  const bigPricepoint = utils.bigNumberify(pricepoint)

  return (Number(bigPricepoint.div(priceMultiplier).toString()) / Number(quoteMultiplier.toString()))
}

export const parseOrder = (order: Order, pair: TokenPair, currAmountPrecision: number = amountPrecision, currPricePrecision: number = pricePrecision) => {

  return {
    time: order.createdAt,
    amount: parseTokenAmount(order.amount, pair, currAmountPrecision),
    filled: parseTokenAmount(order.filledAmount, pair, currAmountPrecision),
    price: parsePricepoint(order.pricepoint, pair, currPricePrecision),
    hash: order.hash,
    side: order.side,
    pair: order.pairName,
    type: 'LIMIT',
    status: order.status,
  }
}

export const parseOrders = (orders: Orders, pairs: Object, currAmountPrecision: number = amountPrecision, currPricePrecision: number = pricePrecision) => {
  const parsedOrders = []

  orders.forEach(order => {
    const pair = pairs[order.pairName]
    if (pair) {
      parsedOrders.push({
        time: order.createdAt,
        amount: parseTokenAmount(order.amount, pair, currAmountPrecision),
        filled: parseTokenAmount(order.filledAmount, pair, currAmountPrecision),
        price: parsePricepoint(order.pricepoint, pair, currPricePrecision),
        hash: order.hash,
        side: order.side,
        pair: order.pairName,
        type: 'LIMIT',
        status: order.status,
      })
    }
  })

  return parsedOrders
}

export const parseTrade = (trade: Trade, pair: TokenPair, currAmountPrecision: number = amountPrecision, currPricePrecision: number = pricePrecision) => {
  return {
    time: trade.createdAt,
    price: parsePricepoint(trade.pricepoint, pair, currPricePrecision),
    amount: parseTokenAmount(trade.amount, pair, currAmountPrecision),
    hash: trade.hash,
    orderHash: trade.orderHash,
    type: trade.type || 'LIMIT',
    side: trade.side,
    pair: trade.pairName,
    status: trade.status === 'SUCCESS' ? 'EXECUTED' : trade.status,
    maker: utils.getAddress(trade.maker),
    taker: utils.getAddress(trade.taker),
  }
}

export const parseTrades = (trades: Trades, pair: TokenPair, currAmountPrecision: number = amountPrecision, currPricePrecision: number = pricePrecision) => {
  const parsed = (trades: any).map(trade => ({
    time: trade.createdAt,
    price: parsePricepoint(trade.pricepoint, pair, currPricePrecision),
    amount: parseTokenAmount(trade.amount, pair, currAmountPrecision),
    hash: trade.hash,
    txHash: trade.txHash,
    orderHash: trade.orderHash,
    type: trade.type || 'LIMIT',
    side: trade.side,
    pair: trade.pairName,
    status: trade.status === 'SUCCESS' ? 'EXECUTED' : trade.status,
    maker: utils.getAddress(trade.maker),
    taker: utils.getAddress(trade.taker),
  }))

  return parsed
}

export const parseTradesByAddress = (trades: Trades, pairs: TokenPair, precision: number = 2) => {
  const parsed = []
  
  trades.forEach(trade => {
    const pair = pairs[trade.pairName]

    parsed.push({
      time: trade.createdAt,
      price: parsePricepoint(trade.pricepoint, pair, precision),
      amount: parseTokenAmount(trade.amount, pair, precision),
      hash: trade.hash,
      txHash: trade.txHash,
      orderHash: trade.orderHash,
      type: trade.type || 'LIMIT',
      side: trade.side,
      pair: trade.pairName,
      status: trade.status === 'SUCCESS' ? 'EXECUTED' : trade.status,
      maker: utils.getAddress(trade.maker),
      taker: utils.getAddress(trade.taker),
    })
  })

  return parsed
}

export const parseOrderBookData = (data: OrderBookData, pair: TokenPair, precision: number = 2) => {
  let { bids, asks } = data

  asks = (asks: any).map(ask => ({
    price: parsePricepoint(ask.pricepoint, pair, precision),
    amount: parseTokenAmount(ask.amount, pair, precision),
  }))

  bids = (bids: any).map(bid => ({
    price: parsePricepoint(bid.pricepoint, pair, precision),
    amount: parseTokenAmount(bid.amount, pair, precision),
  }))

  return { asks, bids }
}

export const parseTokenPairData = (
  data: Array<Object>,
  tokenDecimals: number = defaultDecimals,
): Array<TokenPairData> => {
  const parsed = data.map(datum => ({
    base: null,
    quote: null,
    favorited: null,
    pair: datum.pair.pairName,
    lastPrice: datum.close ? parsePricepoint(datum.close) : null,
    change: datum.open ? computeChange(datum.open, datum.close) : null,
    high: datum.high ? parsePricepoint(datum.high) : null,
    low: datum.low ? parsePricepoint(datum.low) : null,
    volume: datum.volume
      ? parseTokenAmount(datum.volume, tokenDecimals, 0)
      : null,
  }))

  return parsed
}

export const parseTokenPairsData = (data: APIPairData, pairs: Object): Array<TokenPair> => {

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

export const parsePriceBoardData = (data: APIPairData, pairs: Object): Array<TokenPair> => {
  let { last_trade_price, ticks, usd } = data
  if (!last_trade_price
    || ticks.length === 0) return null

  const pair = pairs[ticks[0].pair.pairName]

  last_trade_price = last_trade_price ? parsePricepoint(last_trade_price, pair) : null
  
  ticks = ticks.map(datum => {
      return {
        pair: pair.pair,
        change: datum.open ? computeChange(datum.open, datum.close) : null,
        high: datum.high ? parsePricepoint(datum.high, pair) : null,
        low: datum.low ? parsePricepoint(datum.low, pair) : null,
        open: datum.open ? parsePricepoint(datum.open, pair) : null,
        close: datum.close ? parsePricepoint(datum.close, pair) : null,
        volume: datum.volume ? parseTokenAmount(datum.volume, pair, 0) : null,
      }
  })

  return {
    last_trade_price,
    ticks,
    usd,
  }
}

export const parseOHLCV = (data: Candles, pair: TokenPair): any => {
  const parsed = (data: Candles).map(datum => {
    return {
      date: new Date(datum.timestamp),
      time: datum.timestamp,
      open: parsePricepoint(datum.open, pair),
      high: parsePricepoint(datum.high, pair),
      low: parsePricepoint(datum.low, pair),
      close: parsePricepoint(datum.close, pair),
      volume: parseTokenAmount(datum.volume, pair, 2),
    }
  })

  return parsed
}
