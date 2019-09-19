// @flow
import { ENGINE_HTTP_URL } from '../../../config/environment'
import type { Token } from '../../types/tokens'
import { utils } from 'ethers'
import toDecimalFormString from 'number-to-decimal-form-string-x'

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
import { NATIVE_TOKEN_SYMBOL, NATIVE_TOKEN_ADDRESS } from '../../../config/tokens'

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
    `/pair?baseToken=${baseToken}&quoteToken=${quoteToken}`,
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

export const fetchTomoBalance = async (address: string) => {
  try {
    const response = await request(`/account/${address}/${NATIVE_TOKEN_ADDRESS}`)
    const { data: { balance } } = await response.json()

    return {
      symbol: NATIVE_TOKEN_SYMBOL,
      balance: utils.formatEther(utils.bigNumberify(balance)),
    }
  } catch (e) {
    throw new Error(e)
  }
}

export const fetchTokenBalances = async (address: string, tokens: Array<Token>) => {
  try {
    const tokenRequests = tokens.map(token => {
      return request(`/account/${address}/${token.address}`)
    })

    const responses = await Promise.all(tokenRequests)
    const balances = []

    for (const response of responses) {
      const balanceData = await response.json()
      const { data: { symbol, balance } } = balanceData

      balances.push({ symbol, balance: utils.formatEther(utils.bigNumberify(balance)) })
    }
    return balances
  } catch (e) {
    throw new Error(e)
  }
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

  //Todo: at the moment we use only orders, we'll update pagination then.
  const { data: { orders }} = await response.json()
  return orders || []
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
  quoteToken: string,
) => {
  const response = await request(
    `/trades/pair?baseToken=${baseToken}&quoteToken=${quoteToken}`,
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
  const response = await request(`/trades/history?address=${address}`)
  
  if (response.status === 400) {
    const { error } = await response.json()
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server Error')
  }  

  // Todo: we'll pagination then
  const { data: { trades }} = await response.json()
  return trades || []
}

export const fetchOrderBook = async (baseToken: string, quoteToken: string) => {
  const response = await request(
    `/orderbook?baseToken=${baseToken}&quoteToken=${quoteToken}`,
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
  quoteToken: string,
) => {
  const response = await request(
    `/orderbook/raw?baseToken=${baseToken}&quoteToken=${quoteToken}`,
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
  pairAddresses: PairAddresses,
) => {
  const response = await request(
    `/deposit/generate-address?chain=${chain}&userAddress=${userAddress}`,
    {
      body: JSON.stringify(pairAddresses),
      method: 'POST',
    },
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

export const fetchAccountInfo = async (address: string) => {
  const response = await request(`/account/${address}`)

  const { data, error } = await response.json()

  if (response.status === 404) {
    return null
  }

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

  if (response.status !== 201) {
    throw new Error('Server error')
  }

  console.log(data)
  return data
}

export const getOrderCountByAddress = async (address: string): Promise<number> => {
  const response = await request(`/orders/count?address=${address}`)

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

export const getOrderNonceByAddress = async (address: string): Promise<number> => {
  const response = await request(`/orders/nonce?address=${address}`)

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

export const getOrders = async (userAddress: string): Promise<Orders> => {
  const orders = await fetchOrders(userAddress)
  const parsedOrders = orders ? parseOrders(orders) : []
  return parsedOrders
}

export const getTrades = async (
  baseToken: string,
  quoteToken: string,
): Promise<Trades> => {
  const trades = await fetchTokenPairTrades(baseToken, quoteToken)
  const parsedTrades = parseTrades(trades)

  return parsedTrades
}

export const getTradesByAddress = async (userAddress: string): Promise<Trades> => {
  const trades = await fetchAddressTrades(userAddress)
  const parsedTrades = parseTrades(trades)

  return parsedTrades
}

export const getOrderBookData = async (
  baseToken: string,
  quoteToken: string,
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

export const fetchNotifications = async ({address, offset, limit}) => {
  const response = await request(`/notifications?userAddress=${address}&page=${offset}&perPage=${limit}`)

  const { data, error } = await response.json()

  if (response.status === 400) {
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server error')
  }

  return data
}

export const markAllNotificationsRead = async (recipient) => {
  const response = await request(`/notification/mark/readall`, {
    method: 'PUT',
    body: JSON.stringify({ recipient }),
  })

  const { data, error } = await response.json()

  if (response.status === 400) {
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server error')
  }

  return data
}

export const markNotificationRead = async (id) => {
  const response = await request(`/notification/mark/read`, {
    method: 'PUT',
    body: JSON.stringify({ id }),
  })

  const { data, error } = await response.json()

  if (response.status === 400) {
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server error')
  }

  return data
}

export const markNotificationUnRead = async (id) => {
  const response = await request(`/notification/mark/unread`, {
    method: 'PUT',
    body: JSON.stringify({ id }),
  })

  const { data, error } = await response.json()

  if (response.status === 400) {
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server error')
  }

  return data
}

export const getBalancesInOrders = async (address: string): Promise<number> => {
  const response = await request(`/orders/balance/lock?address=${address}`)

  const { data, error } = await response.json()

  if (response.status === 400) {
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server error')
  }

  for (const key in data) {
    const wei = utils.bigNumberify(toDecimalFormString(data[key]))
    data[key] = parseFloat(utils.formatEther(wei))
  }

  return data
}

export const getTokensAndPairs = async () => {
  try {
    const tokensRaw = await fetchTokens()        

    const tokens = {}
    tokens[NATIVE_TOKEN_ADDRESS] = {
      "name": "Tomochain",
      "symbol": "TOMO",
      "decimals": 18,
      "makeFee": "1",
      "takeFee": "2",
    }

    for (let i = 0; i < tokensRaw.length; i++) {
      const address = tokensRaw[i].contractAddress.toLowerCase()
      tokens[address] = {
      'name': tokensRaw[i].symbol,
      'symbol': tokensRaw[i].symbol,
      'decimals': tokensRaw[i].decimals,
      'makeFee': tokensRaw[i].makeFee,
      'takeFee': tokensRaw[i].takeFee,
      }
    }

    const pairsRaw = await fetchPairs()
    const pairs = []

    for (let j = 0; j < pairsRaw.length; j++) {
      const pair = `${pairsRaw[j].baseTokenSymbol}/${pairsRaw[j].quoteTokenSymbol}`
      pairs.push(pair)
    }

    const addresses = {
      tokens,
      pairs,
    }     

    sessionStorage.setItem('addresses', JSON.stringify(addresses))
    return ({ addresses })
  } catch (err) {
    sessionStorage.setItem('addresses', null)
    return ({ err })
  }
}

