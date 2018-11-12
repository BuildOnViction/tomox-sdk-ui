import { utils } from 'ethers'
import { getOrderHash, getOrderCancelHash, getTradeHash } from '../../../utils/crypto'
import { encodeBytes } from '../../../utils/rlp'
import { feedUpdateDigest, getSwarmSig } from '../../../utils/swarmFeed'
import { createRawOrder as orderCreateRawOrder } from '../orders'
const { BZZ_URL } = require('../../../config/url')

export const getFeedRequest = async function(topic) {
  const userAddress = this.address
  const url = `${BZZ_URL}/bzz-feed:/?user=${userAddress}&topic=${topic}&meta=1`
  const request = await fetch(url).then(res => res.json())
  // checking here?
  return request
}

export const updateSwarmFeed = async function(request, messages) {
  const data = encodeBytes(messages)
  if (!data) return false
  // to upload to server, we need to convert it into Buffer if it is array
  const digest = feedUpdateDigest(request, data)
  const signature = getSwarmSig(this.signingKey.signDigest(digest))
  // the user from feed is lowercase
  const { user, topic } = request.feed
  if (user.toLowerCase() !== this.address.toLowerCase()) {
    throw new Error('Can not update other account')
  }
  const { level, time } = request.epoch
  const url = `${BZZ_URL}/bzz-feed:/?user=${user}&topic=${topic}&level=${level}&time=${time}&signature=${signature}`
  try {
    const res = await fetch(url, {
      method: 'POST',
      header: {
        'Content-Type': 'application/octet-stream'
      },
      // update swarm feed
      body: data
    })
    return res.status === 200
  } catch (err) {
    throw err
  }
}

export const createRawOrder = function(params) {
  return orderCreateRawOrder(this, params)
}

export const createOrderCancel = async function(orderHash) {
  let orderCancel = {}
  orderCancel.orderHash = orderHash
  orderCancel.hash = getOrderCancelHash(orderCancel)

  let signature = await this.signMessage(utils.arrayify(orderCancel.hash))
  let { r, s, v } = utils.splitSignature(signature)
  orderCancel.signature = { R: r, S: s, V: v }

  return orderCancel
}

export const signOrder = async function(order) {
  order.hash = getOrderHash(order)

  let signature = await this.signMessage(utils.arrayify(order.hash))
  let { r, s, v } = utils.splitSignature(signature)

  order.signature = { R: r, S: s, V: v }
  return order
}

export const signTrade = async function(trade) {
  trade.hash = getTradeHash(trade)

  let signature = await this.signMessage(utils.arrayify(trade.hash))
  let { r, s, v } = utils.splitSignature(signature)

  trade.signature = { R: r, S: s, V: v }
  return trade
}
