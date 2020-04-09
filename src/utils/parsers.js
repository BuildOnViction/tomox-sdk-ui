//@flow
import { utils } from 'ethers'
import { BigNumber } from 'bignumber.js'
import { unformat } from 'accounting-js'
import { isFloat, isInteger, round, computeChange, calcPrecision, getLendingPairName } from './helpers'

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

BigNumber.config({ ROUNDING_MODE: 3 }) // The round is floor

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

export const parseBalance = (balance, decimals: Number, precision: Number = pricePrecision): String => {
  // We use 18 to avoid result round to 0. 
  const precisionMultiplier = BigNumber(10).pow(18)
  const multiplier = BigNumber(10).pow(decimals)
  const bigBalance = BigNumber(balance).times(precisionMultiplier)
  const userBalance = ((bigBalance.div(multiplier)).div(precisionMultiplier)).toFixed(precision)

  return userBalance
}

/**
 * Parse amount
 *
 * @param amount
 * @param pair
 * @param precision
 * @returns {number}
 */
export const parseTokenAmount = (amountpoint: string, pair: TokenPair, precision: number = amountPrecision) => {
  const { baseTokenDecimals } = pair
  const precisionMultiplier = BigNumber(10).pow(precision)
  const baseMultiplier = BigNumber(10).pow(baseTokenDecimals)
  const bigAmount = (BigNumber(amountpoint).times(precisionMultiplier)).div(baseMultiplier)
  const amount = bigAmount.div(precisionMultiplier).toFixed(precision)

  return unformat(amount)
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
  // We use 18 to avoid result round to 0. 
  const precisionMultiplier = BigNumber(10).pow(18)
  const quoteMultiplier = BigNumber(10).pow(quoteTokenDecimals)
  const bigPricepoint = BigNumber(pricepoint).times(precisionMultiplier)
  const price = ((bigPricepoint.div(quoteMultiplier)).div(precisionMultiplier)).toFixed(precision)

  return unformat(price)
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
    type: order.type,
    status: order.status,
    orderID: order.orderID,
    baseTokenAddress: order.baseToken,
    quoteTokenAddress: order.quoteToken,
  }
}

export const parseOrders = (orders: Orders, pairs: Object, currAmountPrecision: number = amountPrecision, currPricePrecision: number = pricePrecision) => {
  const parsedOrders = []

  orders.forEach(order => {
    const pair = pairs[order.pairName]
    if (pair) {
      const orderParsed = parseOrder(order, pair, currAmountPrecision, currPricePrecision)

      parsedOrders.push(orderParsed)
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
    type: trade.takerOrderType,
    side: trade.takerOrderSide,
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
    type: trade.takerOrderType,
    side: trade.takerOrderSide,
    pair: trade.pairName,
    status: trade.status === 'SUCCESS' ? 'EXECUTED' : trade.status,
    maker: utils.getAddress(trade.maker),
    taker: utils.getAddress(trade.taker),
  }))

  return parsed
}

export const parseTradesByAddress = (userAddress, trades: Trades, pairs: TokenPair, currAmountPrecision: number = amountPrecision, currPricePrecision: number = pricePrecision) => {
  const parsed = []
  
  trades.forEach(trade => {
    const pair = pairs[trade.pairName]
    const tradeParsed = {
      time: trade.createdAt,
      price: parsePricepoint(trade.pricepoint, pair, currPricePrecision),
      amount: parseTokenAmount(trade.amount, pair, currAmountPrecision),
      hash: trade.hash,
      txHash: trade.txHash,
      orderHash: trade.orderHash,
      type: trade.takerOrderType,
      side: trade.takerOrderSide,
      pair: trade.pairName,
      status: trade.status === 'SUCCESS' ? 'EXECUTED' : trade.status,
      maker: utils.getAddress(trade.maker),
      taker: utils.getAddress(trade.taker),
    }

    if (userAddress === utils.getAddress(trade.maker)) {
      tradeParsed.side = tradeParsed.side === 'BUY' ? 'SELL' : 'BUY'
    }

    parsed.push(tradeParsed)
  })

  return parsed
}

export const parseOrderBookData = (data: OrderBookData, pair: TokenPair, currAmountPrecision: number = amountPrecision, currPricePrecision: number = pricePrecision) => {
  let { bids, asks } = data

  asks = (asks: any).map(ask => ({
    price: parsePricepoint(ask.pricepoint, pair, currPricePrecision),
    amount: parseTokenAmount(ask.amount, pair, currAmountPrecision),
  }))
  
  bids = (bids: any).map(bid => ({
    price: parsePricepoint(bid.pricepoint, pair, currPricePrecision),
    amount: parseTokenAmount(bid.amount, pair, currAmountPrecision),
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
      const pairFomatted = {
        pair: pair.pair,
        price: datum.price ? parsePricepoint(datum.price, pair) : null,
        priceUsd: datum.closeBaseUsd ? datum.closeBaseUsd : null,
        lastPrice: datum.close ? parsePricepoint(datum.close, pair) : null,
        change: datum.open ? computeChange(datum.open, datum.close) : null,
        high: datum.high ? parsePricepoint(datum.high, pair) : null,
        low: datum.low ? parsePricepoint(datum.low, pair) : null,
        volume: datum.volume ? parsePricepoint(datum.volume, pair) : null,
      }

      if (pairFomatted.priceUsd === '0') delete pairFomatted.priceUsd
      const { pricePrecision, amountPrecision } = calcPrecision(pairFomatted.lastPrice)
      const { pricePrecision: pricePrecisionUsd } = calcPrecision(pairFomatted.priceUsd)
      pairFomatted.pricePrecision = pricePrecision
      pairFomatted.pricePrecisionUsd = pricePrecisionUsd
      pairFomatted.amountPrecision = amountPrecision

      result.push(pairFomatted)
    }
  })

  return result
}

export const parsePriceBoardData = (data: APIPairData, pair: Object): Array<TokenPair> => {
  const { last_trade_price, ticks, usd } = data
  if (ticks.length === 0 && last_trade_price === '?') return

  let price = parsePricepoint(last_trade_price, pair)
  const { pricePrecision, amountPrecision } = calcPrecision(price)
  const priceUsd = usd ? BigNumber(price).times(usd).toNumber() : null
  const pricePrecisionUsd = priceUsd ? calcPrecision(priceUsd).pricePrecision : pricePrecision
  const change = ticks.length > 0 ? computeChange(ticks[0].open, ticks[0].close) : null
    
  const ticksParsed = ticks.map(datum => {
      return {
        pair: pair.pair,
        high: datum.high ? parsePricepoint(datum.high, pair) : null,
        low: datum.low ? parsePricepoint(datum.low, pair) : null,
        open: datum.open ? parsePricepoint(datum.open, pair) : null,
        close: datum.close ? parsePricepoint(datum.close, pair) : null,
        volume: datum.volume ? parsePricepoint(datum.volume, pair) : null,
      }
  })

  return {
    price,
    priceUsd,
    change,
    ticks: ticksParsed,
    pricePrecision,
    pricePrecisionUsd,
    amountPrecision,
  }
}

export const parseOHLCV = (data: Candles, pair: TokenPair): any => {
  const latestOHLCV = data.slice(-1)[0]
  const price = parsePricepoint(latestOHLCV.close, pair)
  const { pricePrecision } = calcPrecision(price)

  const parsed = (data: Candles).map(datum => {
    return {
      date: new Date(datum.timestamp),
      time: datum.timestamp,
      open: parsePricepoint(datum.open, pair, pricePrecision),
      high: parsePricepoint(datum.high, pair, pricePrecision),
      low: parsePricepoint(datum.low, pair, pricePrecision),
      close: parsePricepoint(datum.close, pair, pricePrecision),
      volume: parseTokenAmount(datum.volume, pair, 2),
    }
  })

  return parsed
}

export const parseInterest = (interest, decimals = 8) => {
  const interestMultiplier = BigNumber(10).pow(decimals)
  const bigInterest = BigNumber(interest).div(interestMultiplier)
  
  return Number(bigInterest.toFixed(2))
}

export const parseLendingAmount = (amount, decimals = 8) => {
  const amounttMultiplier = BigNumber(10).pow(decimals)
  const bigAmount = BigNumber(amount).div(amounttMultiplier)
  
  return Number(bigAmount.toFixed(8))
}

export const parseLendingOrderBookData = (data, decimals) => {
  let asks, bids
  const { borrow, lend } = data

  asks = lend.map(ask => ({
    interest: parseInterest(ask.interest),
    amount: parseLendingAmount(ask.amount, decimals),
  }))
  
  bids = borrow.map(bid => ({
    interest: parseInterest(bid.interest),
    amount: parseLendingAmount(bid.amount, decimals),
  }))

  return { asks, bids }
}

export const parseLendingTrades = (trades: Trades, decimals) => {
  
  const parsed = (trades: any).map(trade => ({
    time: trade.createdAt,
    interest: parseInterest(trade.interest),
    amount: parseLendingAmount(trade.amount, decimals),
    hash: trade.hash,
    orderHash: trade.investingOrderHash,
    type: trade.takerOrderType,
    side: trade.takerOrderSide,
    status: trade.status,
    borrower: trade.borrower,
    investor: trade.investor,
  }))

  return parsed
}

export const parseLendingPairsData = (pairsData, tokens) => {  
  const parsed = (pairsData: any).map(item => {
    const decimals = tokens[item.lendingID.lendingToken.toLowerCase()].decimals

    return {
      open: parseInterest(item.open),
      close: parseInterest(item.close),
      high: parseInterest(item.high),
      low: parseInterest(item.low),
      pair: getLendingPairName(item.lendingID.name),
      lendingToken: item.lendingID.lendingToken.toLowerCase(),
      term: item.lendingID.term,
      volume: item.volume ? parseLendingAmount(item.volume, decimals) : 0,
    }
  })

  return parsed
}

export const parseLendingOrders = (orders) => {

  const parsed = orders.map(order => {
    return {
      autoTopUp: order.autoTopUp,
      collateralToken: order.collateralToken,
      createdAt: order.createdAt,
      filledAmount: parseLendingAmount(order.filledAmount),
      hash: order.hash,
      interest: parseInterest(order.interest),
      key: order.key,
      lendingId: order.lendingId,
      lendingToken: order.lendingToken,
      nonce: order.nonce,
      amount: parseLendingAmount(order.quantity),
      side: (order.side.toLowerCase() === 'invest') ? 'Lend' : order.side,
      status: order.status,
      term: order.term,
      tradeId: order.tradeId,
      type: order.type,
      updatedAt: order.updatedAt,
      userAddress: order.userAddress,
      time: order.updatedAt,
    }
  })
  
  return parsed
}

export const parseLendingTradesByAddress = (userAddress, trades, pairs) => {

  const parsed = trades.map(trade => {
    const pair = pairs.find(pair => 
      (trade.collateralToken.toLowerCase() === pair.baseTokenAddress) && 
      (trade.lendingToken.toLowerCase() === pair.quoteTokenAddress)
    )

    const liquidationPrice = parsePricepoint(trade.liquidationPrice, pair)
    const { pricePrecision: liquidationPricePrecision } = calcPrecision(liquidationPrice)

    return {
      amount: parseLendingAmount(trade.amount, pair.quoteTokenDecimals),
      borrower: trade.borrower.toLowerCase(),
      isBorrower: trade.borrower.toLowerCase() === userAddress.toLowerCase(),
      borrowingFee: trade.borrowingFee,
      borrowingOrderHash: trade.borrowingOrderHash,
      borrowRelayer: trade.borrowRelayer,
      collateralPrice: trade.collateralPrice,
      collateralToken: trade.collateralToken.toLowerCase(),
      collateralLockedAmount: parseLendingAmount(trade.collateralLockedAmount, pair.baseTokenDecimals),
      createdAt: trade.createdAt,
      depositRate: trade.depositRate,
      hash: trade.hash,
      interest: parseInterest(trade.interest),
      investingFee: trade.investingFee,
      investingOrderHash: trade.investingOrderHash,
      investingRelayer: trade.investingRelayer,
      investor: trade.investor.toLowerCase(),
      lendingToken: trade.lendingToken.toLowerCase(),
      liquidationPrice,
      liquidationPricePrecision,
      liquidationTime: trade.liquidationTime,
      status: trade.status,
      takerOrderSide: trade.takerOrderSide,
      takerOrderType: trade.takerOrderType,
      term: trade.term,
      tradeID: trade.tradeID,
      updatedAt: trade.updatedAt,
      time: trade.updatedAt,
      type: trade.type || 'LO',
      side: (trade.investor.toLowerCase() === userAddress.toLowerCase()) ? 'Lend' : 'BORROW',
    }
  })

  return parsed
}

export const parseLendingPriceBoard = (data, decimals) => {
  
  const parsed = {
    open: parseInterest(data.open),
    close: parseInterest(data.close),
    high: parseInterest(data.high),
    low: parseInterest(data.low),
    pair: getLendingPairName(data.lendingID.name),
    lendingToken: data.lendingID.lendingToken.toLowerCase(),
    term: data.lendingID.term,
    volume: data.volume ? parseLendingAmount(data.volume, decimals) : 0,
    change: computeChange(data.open, data.close),
  }

  return parsed
}

export const parseLendingOHLCV = (data, decimals): any => {

  const parsed = (data: Candles).map(datum => {
    return {
      date: new Date(datum.timestamp),
      time: datum.timestamp,
      open: parseInterest(datum.open),
      high: parseInterest(datum.high),
      low: parseInterest(datum.low),
      close: parseInterest(datum.close),
      volume: datum.volume ? parseLendingAmount(datum.volume, decimals) : 0,
    }
  })

  return parsed
}

