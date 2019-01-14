// @flow
// import tokenPairData from '../../../jsons/tokenPairData.json';
// import orders from '../../../jsons/orders.json';
// import trades from '../../../jsons/trades.json';
// import orderBookData from '../../../jsons/orderBookData.json';
import { ENGINE_HTTP_URL } from '../../../config/environment'

import {
  parseTokenPairData,
  parseOrders,
  parseTrades,
  parseOrderBookData,
} from '../../../utils/parsers'
import fetch from 'isomorphic-fetch'

import type { Orders } from '../../../types/orders'
import type { Trades } from '../../../types/trades'
import type { PairAddresses } from '../../../types/pairs'

const request = (endpoint, options) => {
  return fetch(`${ENGINE_HTTP_URL}${endpoint}`, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      Accept: 'application/json',
      'content-type': 'application/json',
    },
    mode: 'cors',
    ...options,
  })
}

export const fetchInfo = async () => {
  const response = await request(`/info`)
  const { data, error } = await response.json()

  if (response.status !== 200) {
    throw new Error(error)
  }

  return data
}

export const fetchFees = async () => {
  const response = await request('/fees')
  const { data, error } = await response.json()

  if (response.status !== 200) {
    throw new Error(error)
  }

  return data
}

export const fetchTokens = async () => {
  const response = await request(`/tokens`)
  const { data, error } = await response.json()
  if (response.status !== 200) {
    throw new Error(error)
  }

  return data
}

export const fetchToken = async (address: string) => {
  const response = await request(`/tokens/${address}`)
  const { data, error } = await response.json()
  if (response.status !== 200) {
    throw new Error(error)
  }

  return data
}

export const fetchPairs = async () => {
  const response = await request(`/pairs`)
  const { data, error } = await response.json()
  if (response.status !== 200) {
    throw new Error(error)
  }

  return data
}

export const fetchPair = async (baseToken: string, quoteToken: string) => {
  const response = await request(
    `/pair?baseToken=${baseToken}&quoteToken=${quoteToken}`
  )
  const { data, error } = await response.json()

  if (response.status === 400) {
    throw new Error(error)
  }

  if (response.status !== 200) {
    console.log(error)
    throw new Error('Server Error')
  }

  return data
}

export const fetchBalance = async (address: string) => {
  const response = await request(`/balances/${address}`)
  const { data, error } = await response.json()

  if (response.status !== 200) {
    throw new Error(error)
  }

  return data
}

export const fetchOrders = async (address: string) => {
  const response = await request(`/orders?address=${address}`)

  if (response.status === 400) {
    const { error } = await response.json()
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server error')
  }

  const { data } = await response.json()
  return data
}

export const fetchOrderHistory = async (address: string) => {
  const response = await request(`/orders/history?address=${address}`)
  console.log(response.status)
  const { data, error } = await response.json()

  if (response.status === 400) {
    throw new Error(error)
  }

  if (response.status !== 200) {
    console.log(data)
    throw new Error('Server error')
  }

  return data
}

export const fetchOrderPositions = async (address: string) => {
  const response = await request(`/orders/positions?address=${address}`)
  console.log(response.status)
  const { data, error } = await response.json()

  if (response.status === 400) {
    throw new Error(error)
  }

  if (response.status !== 200) {
    console.log(data)
    throw new Error('Server error')
  }

  return data
}

export const fetchTokenPairTrades = async (
  baseToken: string,
  quoteToken: string
) => {
  const response = await request(
    `/trades/pair?baseToken=${baseToken}&quoteToken=${quoteToken}`
  )
  const { data, error } = await response.json()

  if (response.status === 400) {
    throw new Error(error)
  }

  if (response.status !== 200) {
    console.log(data)
    throw new Error('Server Error')
  }

  return data
}

export const fetchAddressTrades = async (address: string) => {
  const response = await request(`/trades?address=${address}`)
  const { data, error } = await response.json()

  if (response.status === 400) {
    throw new Error(error)
  }

  if (response.status !== 200) {
    console.log(data)
    throw new Error('Server Error')
  }

  return data
}

export const fetchOrderBook = async (baseToken: string, quoteToken: string) => {
  const response = await request(
    `/orderbook?baseToken=${baseToken}&quoteToken=${quoteToken}`
  )
  const { data, error } = await response.json()

  if (response.status === 400) {
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server Error')
  }

  return data
}

export const fetchRawOrderBook = async (
  baseToken: string,
  quoteToken: string
) => {
  const response = await request(
    `/orderbook/raw?baseToken=${baseToken}&quoteToken=${quoteToken}`
  )

  const { data, error } = await response.json()

  if (response.status === 400) {
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server Error')
  }

  return data
}

export const generateDepositAddress = async (
  chain: string,
  userAddress: string,
  pairAddresses: PairAddresses
) => {
  const response = await request(
    `/deposit/generate-address?chain=${chain}&userAddress=${userAddress}`,
    {
      body: JSON.stringify(pairAddresses),
      method: 'POST',
    }
  )

  const { data, error } = await response.json()

  if (response.status === 400) {
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server error')
  }

  return data
}

export const fetchTokenPairData = async () => {
  const response = await request('/pairs/data')

  const { data, error } = await response.json()

  if (response.status === 400) {
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server error')
  }

  return data
}

export const createAccount = async (address: string) => {
  const response = await request(`/account/create?address=${address}`, {
    method: 'POST',
  })

  const { data, error } = await response.json()

  if (response.status === 400) {
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server error')
  }

  console.log(data)
  return data
}

// export const getTokenPairData = async () => {
//   const data = parseJSONToFixed(tokenPairData)
//   return data
// }

// export const getOrders = async () => {
//   const data = parseOrders(orders)
//   return data
// }

// export const getTrades = async () => {
//   const data = parseTrades(trades)
//   return data
// }

export const getOrders = async (userAddress: string): Promise<Orders> => {
  const orders = await fetchOrders(userAddress)
  const parsedOrders = orders ? parseOrders(orders) : []
  return parsedOrders
}

export const getTrades = async (
  baseToken: string,
  quoteToken: string
): Promise<Trades> => {
  const trades = await fetchTokenPairTrades(baseToken, quoteToken)
  const parsedTrades = parseTrades(trades)

  return parsedTrades
}

export const getOrderBookData = async (
  baseToken: string,
  quoteToken: string
) => {
  const orderbook = await fetchOrderBook(baseToken, quoteToken)
  const { asks, bids } = parseOrderBookData(orderbook)

  return {
    asks,
    bids,
  }
}

export const getTokenPairData = async () => {
  const data = await fetchTokenPairData()
  const parsedData = parseTokenPairData(data)

  return parsedData
}

export const getExchangeAddress = async () => {
  const data = await fetchInfo()
  const exchangeAddress = data.exchangeAddress

  return exchangeAddress
}

// export const getOrderBookData = async () => {
//   const data = parseOrderBookData(orderBookData)
//   return data
// }

// const main = async () => {
//   let tokens = await fetchAddressTrades("0xE8E84ee367BC63ddB38d3D01bCCEF106c194dc47")
//   console.log(tokens)
// }

// main()
