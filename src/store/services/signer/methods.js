//@flow
import { utils } from 'ethers'
import {
  getOrderHash,
  getOrderCancelHash,
  getTradeHash,
  // getRandomNonce
} from '../../../utils/crypto'

import { encodeBytes } from '../../../utils/rlp'
import {
  feedUpdateDigest,
  getSwarmSig,
  padTopic,
} from '../../../utils/swarmFeed'
import { createRawOrder as orderCreateRawOrder } from '../orders'
// import { EXCHANGE_ADDRESS } from '../../../config/contracts';
// import { round } from '../../../utils/helpers';
import { BZZ_URL } from '../../../config/environment'

// flow
import type {
  NewOrderParams,
  RawOrder,
  OrderCancel,
} from '../../../types/orders'
import type { Request } from '../../../types/swarm'
import type { Trade } from '../../../types/trades'

export const getFeedRequest = async function(topic: string): Promise<Request> {
  const userAddress = this.address
  const url = `${BZZ_URL}/bzz-feed:/?user=${userAddress}&topic=${topic}&meta=1`
  const res = await fetch(url)
  const feedRequest = res.json()

  return feedRequest
}

export const updateSwarmFeed = async function(
  tokenAddress: string,
  messages: any
): Promise<boolean> {
  // padding topic for token address
  const topic = padTopic(tokenAddress)
  const request: Request = await this.getFeedRequest(topic)

  const data = encodeBytes(messages)
  if (!data) return false
  // to upload to server, we need to convert it into Buffer if it is array
  const digest = feedUpdateDigest(feedRequest, data)
  const signature = getSwarmSig(this.signingKey.signDigest(digest))
  // the user from feed is lowercase
  const { user, topic } = feedRequest.feed
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

export const createRawOrder = async function(
  params: NewOrderParams
): Promise<RawOrder> {
  const order = await orderCreateRawOrder(this, params)
  return order
}

export const createOrderCancel = async function(
  orderHash: string
): Promise<OrderCancel> {
  const orderCancel = {}
  orderCancel.orderHash = orderHash
  orderCancel.hash = getOrderCancelHash(orderCancel)

  const signature = await this.signMessage(utils.arrayify(orderCancel.hash))
  const { r, s, v } = utils.splitSignature(signature)
  orderCancel.signature = { r, s, v }

  return orderCancel
}

export const signOrder = async function(order: RawOrder): Promise<RawOrder> {
  order.hash = getOrderHash(order)

  const signature = await this.signMessage(utils.arrayify(order.hash))
  const { r, s, v } = utils.splitSignature(signature)

  order.signature = { r, s, v }
  return order
}

export const signTrade = async function(trade: Trade): Promise<Trade> {
  trade.hash = getTradeHash(trade)

  const signature = await this.signMessage(utils.arrayify(trade.hash))
  const { r, s, v } = utils.splitSignature(signature)

  trade.signature = { r, s, v }
  return trade
}
