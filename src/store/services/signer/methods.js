//@flow
import { utils } from 'ethers'
import { getOrderHash, getOrderCancelHash, getTradeHash, getRandomNonce } from '../../../utils/crypto'
import { computePricepoint, computeAmountPoints } from '../../../utils/helpers'

import { encodeBytes } from '../../../utils/rlp'
import {
  feedUpdateDigest,
  getSwarmSig,
  padTopic,
} from '../../../utils/swarmFeed'

import { BZZ_URL } from '../../../config/environment'

// flow
import type {
  RawOrder,
  OrderCancel,
} from '../../../types/orders'
import type { Request } from '../../../types/swarm'
import type { Trade } from '../../../types/trades'

export const getFeedRequest = async function (topic: string): Promise<Request> {
  const userAddress = this.address
  const url = `${BZZ_URL}/bzz-feed:/?user=${userAddress}&topic=${topic}&meta=1`
  const res = await fetch(url)
  const feedRequest = res.json()

  return feedRequest
}

export const updateSwarmFeed = async function (
  tokenAddress: string,
  messages: any,
): Promise<boolean> {
  // padding topic for token address
  let topic = padTopic(tokenAddress)
  const feedRequest: Request = await this.getFeedRequest(topic)

  const data = encodeBytes(messages)
  if (!data) return false
  // to upload to server, we need to convert it into Buffer if it is array
  const digest = feedUpdateDigest(feedRequest, data)
  const signature = getSwarmSig(this.signingKey.signDigest(digest))
  // the user from feed is lowercase
  const { user } = feedRequest.feed
  topic = feedRequest.feed.topic
  if (user.toLowerCase() !== this.address.toLowerCase()) {
    throw new Error('Can not update other account')
  }
  const { level, time } = feedRequest.epoch
  const url = `${BZZ_URL}/bzz-feed:/?user=${user}&topic=${topic}&level=${level}&time=${time}&signature=${signature}`
  try {
    const res = await fetch(url, {
      method: 'POST',
      header: {
        'Content-Type': 'application/octet-stream',
      },
      // update swarm feed
      body: data,
    })

    const result = res.status === 200

    return result
  } catch (err) {
    throw err
  }
}

// The amountPrecisionMultiplier and pricePrecisionMultiplier are temporary multipliers
// that are used to turn decimal values into rounded integers that can be converted into
// big numbers that can be used to compute large amounts (ex: in wei) with the amountMultiplier
// and priceMultiplier. After multiplying with amountMultiplier and priceMultiplier, the result
// numbers are divided by the precision multipliers.
// So in the end we have:
// amountPoints ~ amount * amountMultiplier ~ amount * 1e18
// pricePoints ~ price * priceMultiplier ~ price * 1e6
export const createRawOrder = async function (params: any) {
  const order = {}
  const { userAddress, exchangeAddress, side, pair, amount, price, makeFee, takeFee } = params
  const { baseTokenAddress, quoteTokenAddress, baseTokenDecimals, quoteTokenDecimals } = pair


  const precisionMultiplier = utils.bigNumberify(10).pow(9)
  const priceMultiplier = utils.bigNumberify(10).pow(18)
  const baseMultiplier = utils.bigNumberify(10).pow(baseTokenDecimals)
  const quoteMultiplier = utils.bigNumberify(10).pow(quoteTokenDecimals)
  const pricepoint = computePricepoint({ price, priceMultiplier, quoteMultiplier, precisionMultiplier })
  const amountPoints = computeAmountPoints({ amount, baseMultiplier, precisionMultiplier })

  order.exchangeAddress = exchangeAddress
  order.userAddress = userAddress
  order.baseToken = baseTokenAddress
  order.quoteToken = quoteTokenAddress
  order.amount = amountPoints.toString()
  order.pricepoint = pricepoint.toString()
  order.side = side
  order.makeFee = makeFee
  order.takeFee = takeFee
  order.nonce = getRandomNonce()
  order.hash = getOrderHash(order)

  const signature = await this.signMessage(utils.arrayify(order.hash))
  const { r, s, v } = utils.splitSignature(signature)

  order.signature = { R: r, S: s, V: v }
  return order
}

export const createOrderCancel = async function (
  orderHash: string,
): Promise<OrderCancel> {
  const orderCancel = {}
  orderCancel.orderHash = orderHash
  orderCancel.hash = getOrderCancelHash(orderCancel)

  const signature = await this.signMessage(utils.arrayify(orderCancel.hash))
  const { r, s, v } = utils.splitSignature(signature)
  orderCancel.signature = { R: r, S: s, V: v }

  return orderCancel
}

export const signOrder = async function (order: RawOrder): Promise<RawOrder> {
  order.hash = getOrderHash(order)

  const signature = await this.signMessage(utils.arrayify(order.hash))
  const { r, s, v } = utils.splitSignature(signature)

  order.signature = { r, s, v }
  return order
}

export const signTrade = async function (trade: Trade): Promise<Trade> {
  trade.hash = getTradeHash(trade)

  const signature = await this.signMessage(utils.arrayify(trade.hash))
  const { r, s, v } = utils.splitSignature(signature)

  trade.signature = { r, s, v }
  return trade
}
