//@flow

import { utils } from 'ethers'
import { getOrderHash, getTradeHash } from '../../utils/crypto'

import type { RawOrder } from '../../types/orders'
import type { Signer } from '../../types/signer'
import type { Trade } from '../../types/trades'

export const validateOrderHash = (hash: string, order: RawOrder): boolean => {
  const computedHash = getOrderHash(order)

  return computedHash === hash
}

export const validateTradeHash = (hash: string, trade: Trade): boolean => {
  const computedHash = getTradeHash(trade)

  return computedHash === hash
}

// We currently assume that the order is already signed
export const signOrder = async (signer: Signer, order: RawOrder) => {
  const computedHash = getOrderHash(order)
  if (order.hash !== computedHash) throw new Error('Invalid Hash')

  const signature = await signer.signMessage(utils.arrayify(order.hash))
  const { r, s, v } = utils.splitSignature(signature)

  order.signature = {
    r,
    s,
    v,
  }
  return order
}

export const signTrade = async (signer: Signer, trade: Trade) => {
  const computedHash = getTradeHash(trade)
  if (trade.hash !== computedHash) throw new Error('Invalid Hash')

  const signature = await signer.signMessage(utils.arrayify(trade.hash))
  const { r, s, v } = utils.splitSignature(signature)

  trade.signature = {
    r,
    s,
    v,
  }
  return trade
}
