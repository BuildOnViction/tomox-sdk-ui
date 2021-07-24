// @flow
import { ENGINE_HTTP_URL, TOMO_BRIDGE_URL } from '../../../config/environment'
import type { Token } from '../../types/tokens'
import { utils } from 'ethers'
import toDecimalFormString from 'number-to-decimal-form-string-x'

import {
  parseTokenPairData,
  parseOrders,
  parseTrades,
  parseOrderBookData,
  parseBalance,
} from '../../../utils/parsers'
import fetch from 'isomorphic-fetch'

import type { Orders } from '../../../types/orders'
import type { Trades } from '../../../types/trades'
import type { PairAddresses } from '../../../types/pairs'
import { NATIVE_TOKEN_SYMBOL, NATIVE_TOKEN_ADDRESS } from '../../../config/tokens'

const qs = require('querystringify')

const request = (endpoint, options, engine = ENGINE_HTTP_URL) => {
  return fetch(`${engine}${endpoint}`, {
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

export const fetchOrders = async (address: string, status: string) => {
  const statusAvailable = ['OPEN', 'PARTIAL_FILLED']
  const url = status && statusAvailable.includes(status.toUpperCase()) ? `/orders?address=${address}&orderStatus=${status.toUpperCase()}` : `/orders?address=${address}`
  const response = await request(url)

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
  const response = await request(`/account/${address}`, { 'pragma': 'no-cache', 'cache-control': 'no-cache'})

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

export const fetchVerifiedTokens = async () => {
  try {
    // disable deposit/withdrawal
    // const response = await request('/api/config', {}, TOMO_BRIDGE_URL)

    // if (response.status === 400) {
    //   const { error } = await response.json()
    //   throw new Error(error)
    // }
  
    // if (response.status !== 200) {
    //   throw new Error('Server error')
    // }
  
    // const data = await response.json()
    // const tokensOnBridge = data.swapCoin.map(token => token.wrapperAddress.toLowerCase())
    
    // return { data: tokensOnBridge }
    return { data: [] }
  } catch (error) {
    return { error }
  }
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

export const getBalancesInOrders = async (address: string, tokens: Array<Object>): Promise<number> => {
  const response = await request(`/orders/balance/lock?address=${address}`)

  const { data, error } = await response.json()

  if (response.status === 400) {
  throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server error')
  }

  const nativeTokenBalance = toDecimalFormString(data[NATIVE_TOKEN_SYMBOL])
  data[NATIVE_TOKEN_SYMBOL] = utils.formatEther(nativeTokenBalance)

  for (let i = 0; i < tokens.length; i++) {
    const tokenBalance = toDecimalFormString(data[tokens[i].symbol])
    data[tokens[i].symbol] = parseBalance(tokenBalance, tokens[i].decimals)
  }

  return data
}

export const getTokensAndPairs = async () => {
  try {
    const tokensRaw = await fetchTokens()
    const { data, error } = await fetchVerifiedTokens()    
    const verifiedTokens = !error ? data : []

    const tokens = {}
    tokens[NATIVE_TOKEN_ADDRESS] = {
      "name": "Tomochain",
      "symbol": "TOMO",
      "decimals": 18,
    }

    for (let i = 0; i < tokensRaw.length; i++) {
      const address = tokensRaw[i].contractAddress.toLowerCase()

      tokens[address] = {
        'name': tokensRaw[i].symbol,
        'symbol': tokensRaw[i].symbol,
        'decimals': tokensRaw[i].decimals,
        'verified': verifiedTokens.includes(address),
        address,
      }
    }

    const pairsRaw = await fetchPairs()

    const pairs = pairsRaw.reduce((result, item) => {
      const pair = `${item.baseTokenSymbol}/${item.quoteTokenSymbol}`
      result[pair] = {...item, pair}
      return result
    }, {})

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

export const fetchLendingTokens = async _ => {
  const response = await request('/lending/lendingtoken')

  if (response.status === 400) {
    const { error } = await response.json()
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server error')
  }

  const { data } = await response.json()
  return data ? data : []
}

export const fetchLendingCollaterals = async _ => {
  const response = await request('/lending/collateraltoken')

  if (response.status === 400) {
    const { error } = await response.json()
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server error')
  }

  const { data } = await response.json()
  return data ? data : []
}

export const fetchLendingPairs = async _ => {
  const response = await request('/lending/pairs')

  if (response.status === 400) {
    const { error } = await response.json()
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server error')
  }

  const { data } = await response.json()
  return data ? data : []
} 

export const fetchLendingTerms = async _ => {
  const response = await request('/lending/terms')

  if (response.status === 400) {
    const { error } = await response.json()
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server error')
  }

  const { data: { terms }} = await response.json()
  return terms
} 


export const fetchLendingOrders = async (address) => {
  const response = await request(`/lending/orders?address=${address}`)

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

export const fetchLendingAddressTrades = async (address) => {
  const response = await request(`/lending/trades/history?address=${address}`)

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

export const getLendingOrderNonce = async (address: string): Promise<number> => {
  const response = await request(`/lending/nonce?address=${address}`)

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

export const getEstimatedCollateral = async (params): Promise<number> => {
  const qsString = qs.stringify(params, true)
  const response = await request(`/lending/estimate${qsString}`)

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

export const cancelLendingOrder = async (payload) => {
  const response = await request(
    '/lending/cancel',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  )

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

export const topUpLendingOrder = async (payload) => {
  const response = await request(
    '/lending/topup',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  )

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

export const repayLendingOrder = async (payload) => {
  const response = await request(
    '/lending/repay',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }
  )

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

export const getBridgeTokenConfig = async () => {
  try {
    const response = await request('/api/config', {}, TOMO_BRIDGE_URL)

    if (response.status === 400) {
      const { error } = await response.json()
      throw new Error(error)
    }
  
    if (response.status !== 200) {
      throw new Error('Server error')
    }
  
    const data = await response.json()

    return data.swapCoin
  } catch (e) {
    console.log(e)
    return []
  }
  
}

export const getBridgeDepositAddress = async (payload) => {
  const response = await request(
    '/api/wrap/getAddress', 
    {
      method: 'POST',
      body: JSON.stringify(payload),
    }, 
    TOMO_BRIDGE_URL
  )

  if (response.status === 400) {
    const { error } = await response.json()
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server error')
  }

  const data = await response.json()
  return data
}

export const getBridgeDepositHistory = async (address, page = 1, limit = 5) => {
  const response = await request(`/api/transactions/getWrapTxs?address=${address}&page=${page}&limit=${limit}`, {}, TOMO_BRIDGE_URL)

  if (response.status === 400) {
    const { error } = await response.json()
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server error')
  }

  const data = await response.json()
  return data
}

export const getBridgeWithdrawHistory = async (address, page = 1, limit = 5) => {
  const response = await request(`/api/transactions/getUnwrapTxs?address=${address}&page=${page}&limit=${limit}`, {}, TOMO_BRIDGE_URL)

  if (response.status === 400) {
    const { error } = await response.json()
    throw new Error(error)
  }

  if (response.status !== 200) {
    throw new Error('Server error')
  }

  const data = await response.json()
  return data
}