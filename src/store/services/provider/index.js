import { DEFAULT_NETWORK_ID } from '../../../config/environment'
import { ERC20 } from '../../../config/abis'
import { EXCHANGE_ADDRESS } from '../../../config/contracts'
import { utils, Contract } from 'ethers'

import { createProvider } from '../../../utils/provider'
import { NATIVE_TOKEN_SYMBOL } from '../../../config/tokens'

export const createConnection = () => {
  switch (DEFAULT_NETWORK_ID) {
    case '1':
      return (window.provider = createProvider('homestead'))
    case '4':
      return (window.provider = createProvider('rinkeby'))
    case DEFAULT_NETWORK_ID:
      return (window.provider = createProvider('local'))
    default:
      throw new Error('unknown network')
  }
}

export async function queryTokenBalances(
  address: string,
  tokens: Array<Token>
) {
  const balancePromises = tokens.map(token => {
    const contract = new Contract(token.address, ERC20, window.provider)
    return contract.balanceOf(address)
  })

  const resolvingPromises = balancePromises.map((promise, i) => {
    return new Promise(resolve => {
      const payload = new Array(2)
      promise
        .then(result => {
          payload[0] = {
            symbol: tokens[i].symbol,
            balance: utils.formatUnits(result, tokens[i].decimals),
          }
        })
        .catch(error => {
          payload[1] = error
        })
        .then(() => {
          resolve(payload)
        })
    })
  })

  const errors = []
  const tokenBalances = []

  return Promise.all(resolvingPromises).then(items => {
    items.forEach(payload => {
      if (payload[1]) {
        errors.push(payload[1])
      } else {
        tokenBalances.push(payload[0])
      }
    })

    return {
      errors,
      tokenBalances,
    }
  })
}

export async function queryExchangeTokenAllowances(
  owner: string,
  tokens: Array<Token>
) {
  const provider = window.provider
  const exchange = EXCHANGE_ADDRESS[provider.network.chainId]

  const allowancePromises = tokens.map(token => {
    const contract = new Contract(token.address, ERC20, provider)
    return contract.allowance(owner, exchange)
  })

  const resolvingPromises = allowancePromises.map((promise, i) => {
    return new Promise(resolve => {
      const payload = new Array(2)
      promise
        .then(result => {
          payload[0] = {
            symbol: tokens[i].symbol,
            allowance: utils.formatUnits(result, tokens[i].decimals),
          }
        })
        .catch(error => {
          payload[1] = error
        })
        .then(() => {
          resolve(payload)
        })
    })
  })

  const errors = []
  const tokenAllowances = []

  return Promise.all(resolvingPromises).then(items => {
    items.forEach(payload => {
      if (payload[1]) {
        errors.push(payload[1])
      } else {
        tokenAllowances.push(payload[0])
      }
    })

    return {
      errors,
      tokenAllowances,
    }
  })
}

export async function queryTokenAllowances(
  owner: string,
  spender: string,
  tokens: Array<Token>
) {
  let allowances
  const provider = window.provider
  const allowancePromises = tokens.map(token => {
    const contract = new Contract(token.address, ERC20, provider)
    return contract.allowance(owner, spender)
  })

  allowances = await Promise.all(allowancePromises)
  allowances = (allowances: TokenBalances).map((allowance, i) => ({
    symbol: tokens[i].symbol,
    allowance: utils.formatUnits(allowance, tokens[i].decimals),
  }))

  return allowances
}

export async function subscribeTomoBalance(
  address: string,
  callback: number => void
) {
  const provider = window.provider

  const handler = balance => {
    callback(utils.formatEther(balance))
  }

  provider.on(address, handler)

  return () => {
    provider.removeListener(address, handler)
  }
}

export async function subscribeTokenBalance(
  address: string,
  token: Object,
  callback: number => void
) {
  const provider = window.provider
  const contract = new Contract(token.address, ERC20, provider)

  const initialBalance = await contract.balanceOf(address)
  const handler = async (sender, receiver, tokens) => {
    if (receiver === address) {
      const balance = await contract.balanceOf(receiver)
      if (balance !== initialBalance) callback(utils.formatEther(balance))
    }
  }

  contract.on('Transfer', handler)

  return () => {
    provider.removeListener(address, handler)
  }
}

export async function subscribeTokenBalances(
  address: string,
  tokens: Array<Token>,
  callback: AccountBalance => any
) {
  const provider = window.provider
  const handlers = []

  tokens.map(async token => {
    const contract = new Contract(token.address, ERC20, provider)
    // const initialBalance = await contract.balanceOf(address)

    const handler = async (sender, receiver, amount) => {
      if (receiver === address || sender === address) {
        const balance = await contract.balanceOf(address)
        callback({
          symbol: token.symbol,
          balance: utils.formatUnits(balance, token.decimals),
        })
      }
    }

    contract.on('Transfer', handler)
    handlers.push(handler)
  })

  return () => {
    handlers.forEach(handler => provider.removeListener(address, handler))
  }
}

export async function subscribeTokenAllowance(
  address: string,
  token: Object,
  callback: number => void
) {
  const provider = window.provider
  const exchange = EXCHANGE_ADDRESS[provider.network.chainId]
  const contract = new Contract(token.address, ERC20, provider)

  const initialAllowance = await contract.allowance(exchange, address)
  const handler = async (sender, receiver, tokens) => {
    if (receiver === address) {
      const allowance = await contract.allowance(exchange, receiver)
      if (allowance !== initialAllowance)
        callback(utils.formatUnits(allowance, token.decimals))
    }
  }

  contract.on('Approval', handler)

  return () => {
    provider.removeListener(address, handler)
  }
}

export async function subscribeTokenAllowances(
  address: string,
  tokens: Array<Token>,
  callback: AccountAllowance => any
) {
  const provider = window.provider
  const exchange = EXCHANGE_ADDRESS[provider.network.chainId]
  const handlers = []

  tokens.map(async token => {
    const contract = new Contract(token.address, ERC20, provider)
    const handler = async (owner, spender, amount) => {
      if (owner === address && spender === exchange) {
        const allowance = await contract.allowance(owner, exchange)
        callback({
          symbol: token.symbol,
          allowance: utils.formatUnits(allowance, token.decimals),
        })
      }
    }

    contract.on('Approval', handler)
    handlers.push(handler)
  })

  return () => {
    handlers.forEach(handler => provider.removeListener(address, handler))
  }
}

export async function queryTomoBalance(address: string) {
  const provider = window.provider
  const balance = await provider.getBalance(address)

  return {
    symbol: NATIVE_TOKEN_SYMBOL,
    balance: utils.formatEther(balance),
  }
}
