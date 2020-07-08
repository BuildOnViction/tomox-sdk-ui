//@flow
import { utils } from 'ethers'
import { BigNumber } from 'bignumber.js'
import { unformat } from 'accounting-js'
import { differenceInSeconds } from 'date-fns'

import { isFloat, isInteger, round, computeChange, calcPrecision, getLendingPairName, estimateProfit } from './helpers'
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
  let userBalance = ((bigBalance.div(multiplier)).div(precisionMultiplier)).toFixed(precision)
  userBalance = (Number(userBalance) <= 0) ? 0 : userBalance

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

export const parseOrder = (order: Order, pairs: Array<TokenPair>, currAmountPrecision: number = amountPrecision, currPricePrecision: number = pricePrecision) => {

  const orderPair = pairs.find(pair => pair.baseTokenAddress.toLowerCase() === order.baseToken.toLowerCase() 
                                      && pair.quoteTokenAddress.toLowerCase() === order.quoteToken.toLowerCase())
  
  return {
    time: order.createdAt,
    amount: parseTokenAmount(order.amount, orderPair, currAmountPrecision),
    filled: parseTokenAmount(order.filledAmount, orderPair, currAmountPrecision),
    price: parsePricepoint(order.pricepoint, orderPair, currPricePrecision),
    hash: order.hash,
    side: order.side,
    pair: orderPair.pair,
    type: order.type,
    status: order.status,
    orderID: order.orderID,
    baseTokenAddress: order.baseToken,
    quoteTokenAddress: order.quoteToken,
  }
}

export const parseOrders = (orders: Orders, pairs: Object[], currAmountPrecision: number = amountPrecision, currPricePrecision: number = pricePrecision) => {
  const parsedOrders = []

  orders.forEach(order => {
    const orderParsed = parseOrder(order, pairs, currAmountPrecision, currPricePrecision)

    parsedOrders.push(orderParsed)
  })

  return parsedOrders
}

export const parseTrade = (trade: Trade, pairs: Arrays<TokenPair>, currAmountPrecision: number = amountPrecision, currPricePrecision: number = pricePrecision) => {
  
  const tradePair = pairs.find(pair => pair.baseTokenAddress.toLowerCase() === trade.baseToken.toLowerCase() 
                                      && pair.quoteTokenAddress.toLowerCase() === trade.quoteToken.toLowerCase())
  
  return {
    time: trade.createdAt,
    price: parsePricepoint(trade.pricepoint, tradePair, currPricePrecision),
    amount: parseTokenAmount(trade.amount, tradePair, currAmountPrecision),
    hash: trade.hash,
    orderHash: trade.orderHash,
    type: trade.takerOrderType,
    side: trade.takerOrderSide,
    pair: tradePair.pair,
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
    pair: pair.pair,
    status: trade.status === 'SUCCESS' ? 'EXECUTED' : trade.status,
    maker: utils.getAddress(trade.maker),
    taker: utils.getAddress(trade.taker),
  }))

  return parsed
}

export const parseTradesByAddress = (userAddress: String, exchangeAddress: String, trades: Trades, pairs: Object[], currAmountPrecision: number = amountPrecision, currPricePrecision: number = pricePrecision) => {
  const parsed = []
  
  for (let i = 0; i < trades.length; i++) {
    if (userAddress.toLowerCase() === trades[i].maker.toLowerCase() && exchangeAddress.toLowerCase() !== trades[i].makerExchange.toLowerCase()) continue
    if (userAddress.toLowerCase() === trades[i].taker.toLowerCase() && exchangeAddress.toLowerCase() !== trades[i].takerExchange.toLowerCase()) continue

    const pair = pairs.find(item => item.baseTokenAddress.toLowerCase() === trades[i].baseToken.toLowerCase() 
                                  && item.quoteTokenAddress.toLowerCase() === trades[i].quoteToken.toLowerCase())
    
    const tradeParsed = {
      time: trades[i].createdAt,
      price: parsePricepoint(trades[i].pricepoint, pair, currPricePrecision),
      amount: parseTokenAmount(trades[i].amount, pair, currAmountPrecision),
      hash: trades[i].hash,
      txHash: trades[i].txHash,
      orderHash: trades[i].orderHash,
      type: trades[i].takerOrderType,
      side: trades[i].takerOrderSide,
      pair: pair.pair,
      status: trades[i].status === 'SUCCESS' ? 'EXECUTED' : trades[i].status,
      maker: utils.getAddress(trades[i].maker),
      taker: utils.getAddress(trades[i].taker),
    }

    if (userAddress.toLowerCase() === utils.getAddress(trades[i].maker).toLowerCase()) {
      tradeParsed.side = tradeParsed.side.toUpperCase() === 'BUY' ? 'SELL' : 'BUY'
    }

    parsed.push(tradeParsed)
  }

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
  if (!ticks || (ticks.length === 0 && last_trade_price === '?')) return

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
      volume: parseTokenAmount(datum.volume, pair, 4),
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
    createdAt: trade.createdAt,
    updatedAt: trade.updatedAt,
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

export const parseLendingPairsData = (pairsData: Array<Object>, tokens: Object) => {  
  const parsed = []
  
  for (let i = 0; i < pairsData.length; i++) {
    if (!tokens[pairsData[i].lendingID.lendingToken.toLowerCase()]) continue

    const decimals = tokens[pairsData[i].lendingID.lendingToken.toLowerCase()].decimals

    const tradePased = {
      open: parseInterest(pairsData[i].open),
      close: parseInterest(pairsData[i].close),
      high: parseInterest(pairsData[i].high),
      low: parseInterest(pairsData[i].low),
      pair: getLendingPairName(pairsData[i].lendingID.name),
      pairValueAddress: `${pairsData[i].lendingID.term}/${pairsData[i].lendingID.lendingToken.toLowerCase()}`,
      lendingToken: pairsData[i].lendingID.lendingToken.toLowerCase(),
      term: Number(pairsData[i].lendingID.term),
      volume: pairsData[i].volume ? parseLendingAmount(pairsData[i].volume, decimals) : 0,
      change: computeChange(pairsData[i].open, pairsData[i].close),
    }

    parsed.push(tradePased)
  }

  return parsed
}

export const parseLendingOrders = (orders, tokens: Object[]) => {

  const parsed = orders.map(order => {
    const decimals = tokens[order.lendingToken] ? tokens[order.lendingToken].decimals : 6

    return {
      autoTopUp: order.autoTopUp,
      collateralToken: order.collateralToken,
      createdAt: order.createdAt,
      filledAmount: parseLendingAmount(order.filledAmount, decimals),
      hash: order.hash,
      interest: parseInterest(order.interest),
      key: order.key,
      lendingId: order.lendingId,
      lendingToken: order.lendingToken,
      nonce: order.nonce,
      amount: parseLendingAmount(order.quantity, decimals),
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

export const parseLendingTradesByAddress = (userAddress, exchangeAddress, trades, tokens) => {

  const parsed = []
  
  for (let i = 0; i < trades.length; i++) {
    if (userAddress.toLowerCase() === trades[i].borrower.toLowerCase() && exchangeAddress.toLowerCase() !== trades[i].borrowingRelayer.toLowerCase()) continue
    if (userAddress.toLowerCase() === trades[i].investor.toLowerCase() && exchangeAddress.toLowerCase() !== trades[i].investingRelayer.toLowerCase()) continue

    const collateralToken = tokens[trades[i].collateralToken.toLowerCase()]
    const lendingToken = tokens[trades[i].lendingToken.toLowerCase()]

    if (!collateralToken || !lendingToken) continue

    const liquidationPrice = parsePricepoint(trades[i].liquidationPrice, { quoteTokenDecimals: lendingToken.decimals })
    const { pricePrecision: liquidationPricePrecision } = calcPrecision(liquidationPrice)
    const side = (trades[i].investor.toLowerCase() === userAddress.toLowerCase() 
                  && trades[i].investor.toLowerCase() !== trades[i].borrower.toLowerCase()) ? 'LEND' : 'BORROW'
    const amount = parseLendingAmount(trades[i].amount, lendingToken.decimals)
    const interest = parseInterest(trades[i].interest)
    let estimatedProfit, profit

    if (side === 'LEND' && trades[i].status.toUpperCase() === 'OPEN') {
      estimatedProfit = estimateProfit(amount, interest, trades[i].term)
    }

    if (side === 'LEND' && trades[i].status.toUpperCase() === 'CLOSED') {
      const realTimeLending = differenceInSeconds(
                                new Date(trades[i].updatedAt),
                                new Date(trades[i].createdAt)
                              )
      const timeToGetProfit = BigNumber(realTimeLending).plus(trades[i].term).div(2*365*24*60*60)
      profit = BigNumber(amount).multipliedBy(interest/100).multipliedBy(timeToGetProfit).toFixed(8)
    }
    
    const tradeParsed = {
      amount,
      borrower: trades[i].borrower.toLowerCase(),
      isBorrower: trades[i].borrower.toLowerCase() === userAddress.toLowerCase(),
      borrowingFee: trades[i].borrowingFee,
      borrowingOrderHash: trades[i].borrowingOrderHash,
      borrowRelayer: trades[i].borrowRelayer,
      collateralPrice: trades[i].collateralPrice,
      collateralToken: trades[i].collateralToken.toLowerCase(),
      collateralLockedAmount: parseLendingAmount(trades[i].collateralLockedAmount, collateralToken.decimals),
      createdAt: trades[i].createdAt,
      depositRate: trades[i].depositRate,
      hash: trades[i].hash,
      interest,
      investingFee: trades[i].investingFee,
      investingOrderHash: trades[i].investingOrderHash,
      investingRelayer: trades[i].investingRelayer,
      investor: trades[i].investor.toLowerCase(),
      lendingToken: trades[i].lendingToken.toLowerCase(),
      liquidationPrice,
      liquidationPricePrecision,
      liquidationTime: trades[i].liquidationTime,
      status: trades[i].status,
      takerOrderSide: trades[i].takerOrderSide,
      takerOrderType: trades[i].takerOrderType,
      term: trades[i].term,
      tradeID: trades[i].tradeID,
      updatedAt: trades[i].updatedAt,
      time: trades[i].createdAt,
      type: trades[i].type || 'LO',
      side,
      autoTopUp: trades[i].autoTopUp,
      estimatedProfit,
      profit,
    }

    parsed.push(tradeParsed)
  }

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

