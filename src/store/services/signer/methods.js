//@flow
import { utils } from 'ethers'
import { getOrderHash, getOrderCancelHash, getMarketOrderHash } from '../../../utils/crypto'
import { computePricepoint, computeAmountPoints, isTomoWallet } from '../../../utils/helpers'

// flow
import type {
  OrderCancel,
} from '../../../types/orders'
import { amountPrecision, pricePrecision } from '../../../config/tokens'

export const createRawOrder = async function (params: any) {
  const order = {}
  const { userAddress, exchangeAddress, side, type, status, pair, amount, price, orderNonce } = params
  const { quoteTokenSymbol, baseTokenAddress, quoteTokenAddress, baseTokenSymbol, baseTokenDecimals, quoteTokenDecimals } = pair


  const pricePrecisionMultiplier = utils.bigNumberify(10).pow(pricePrecision)
  const amountPrecisionMultiplier = utils.bigNumberify(10).pow(amountPrecision)
  const baseMultiplier = utils.bigNumberify(10).pow(baseTokenDecimals)
  const quoteMultiplier = utils.bigNumberify(10).pow(quoteTokenDecimals)
  const pricepoint = computePricepoint({ price, quoteMultiplier, pricePrecisionMultiplier })
  const amountPoints = computeAmountPoints({ amount, baseMultiplier, amountPrecisionMultiplier })

  order.baseTokenSymbol = baseTokenSymbol
  order.quoteTokenSymbol = quoteTokenSymbol
  order.exchangeAddress = exchangeAddress
  order.userAddress = userAddress
  order.baseToken = baseTokenAddress
  order.quoteToken = quoteTokenAddress
  order.userAmount = amount
  order.userPrice = price
  order.amount = amountPoints.toString()
  order.pricepoint = pricepoint.toString()
  order.side = side
  order.type = type
  order.status = status
  order.nonce = orderNonce.toString()
  order.hash = (type.toLowerCase() === 'lo') ? getOrderHash(order) : getMarketOrderHash(order)
  
  let signature = null

  if (isTomoWallet() && window.location.href.includes('.tomochain.com')) {
    order.action = 'CREATE' 
    const orderBase64 = window.btoa(JSON.stringify(order))
    signature = await this.signMessage(`TOMOX_ORDER:${orderBase64}`)
  } else {
    signature = await this.signMessage(utils.arrayify(order.hash))
  }

  const { r, s, v } = utils.splitSignature(signature)

  order.signature = { R: r, S: s, V: v }
  return order
}

export const createOrderCancel = async function (
  order: Object
): Promise<OrderCancel> {
  let orderCancel = order
  orderCancel.nonce = order.nonce.toString()
  orderCancel.orderHash = order.hash
  orderCancel.hash = getOrderCancelHash(orderCancel)
  let signature = null

  if (isTomoWallet() && window.location.href.includes('.tomochain.com')) {
    orderCancel = {...order, ...orderCancel}
    orderCancel.action = 'CANCEL'
    const orderBase64 = window.btoa(JSON.stringify(orderCancel))
    signature = await this.signMessage(`TOMOX_ORDER:${orderBase64}`)
  } else {
    signature = await this.signMessage(utils.arrayify(orderCancel.hash))
  }

  const { r, s, v } = utils.splitSignature(signature)
  orderCancel.signature = { R: r, S: s, V: v }
  return orderCancel
}

export const signLendingOrder = async function(order) {
  const signature = await this.signMessage(utils.arrayify(order.hash))
  const { r, s, v } = utils.splitSignature(signature)

  order.signature = { R: r, S: s, V: v }
  return order
}

export const signLendingCancelOrder = async function(orderHashed) {
  const signature = await this.signMessage(utils.arrayify(orderHashed))
  const { r, s, v } = utils.splitSignature(signature)

  return { R: r, S: s, V: v }
}