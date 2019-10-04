// @flow
import {Contract, utils} from 'ethers'
import {ERC20} from '../../config/abis'
// import {EXCHANGE_ADDRESS} from '../../config/contracts'
import {getProvider} from './signer'
import {NATIVE_TOKEN_SYMBOL} from '../../config/tokens'
import type {Token, TokenBalance} from '../../types/tokens'
import { parseBalance } from '../../utils/parsers'

export async function queryTomoBalance(address: string): Promise<TokenBalance> {
  const provider = getProvider()

  const balance = await provider.getBalance(address)
  return {
    symbol: NATIVE_TOKEN_SYMBOL,
    balance: utils.formatEther(balance),
  }
}

export async function queryTokenBalances(
  address: string,
  tokens: Array<Token>,
): Promise<TokenBalances> {
  const provider = getProvider()

  const balancePromises = tokens.map(async token => {
    const contract = new Contract(token.address, ERC20, provider)
    try {
    return await contract.balanceOf(address)
    } catch (e) {
      console.log(address, e)
      return null
    }
  })

  const balances = await Promise.all(balancePromises)

  const tokenBalances = balances
    .filter(balance => balance !== null)
    .map((balance, i) => ({
      symbol: tokens[i].symbol,
      balance: parseBalance(balance, tokens[i].decimals),
    }))
  return tokenBalances
}

export async function subscribeTomoBalance(
  address: string,
  callback: number => void,
) {
  const provider = getProvider()
  const initialBalance = await provider.getBalance(address)

  const handler = async balance => {
    if (balance !== initialBalance) callback(utils.formatEther(balance))
  }

  provider.on(address, handler)

  return () => {
    provider.removeListener(address, handler)
  }
}

export async function subscribeTokenBalance(
  address: string,
  token: Object,
  callback: number => void,
) {
  const provider = getProvider()
  const contract = new Contract(token.address, ERC20, provider)

  const initialBalance = await contract.balanceOf(address)
  const handler = async (sender, receiver, tokens) => {
    if (receiver === address) {
      const balance = await contract.balanceOf(receiver)
      if (balance !== initialBalance) callback(parseBalance(balance, token.decimals))
    }
  }

  // contract.ontransfer = handler
  contract.on("Transfer", handler)

  return () => {
    provider.removeListener(address, handler)
  }
}

export async function subscribeTokenBalances(
  address: string,
  tokens: Array<Token>,
  callback: TokenBalance => any,
) {
  const provider = getProvider()
  const handlers = []

  tokens.map(async token => {
    const contract = new Contract(token.address, ERC20, provider)

    const handler = async (sender, receiver, amount) => {
      if (receiver.toLowerCase() === address.toLowerCase() 
      || sender.toLowerCase() === address.toLowerCase()) {
        const balance = await contract.balanceOf(address)
        callback({
          symbol: token.symbol,
          balance: parseBalance(balance, token.decimals),
        })
      }
    }

    window.abi = ERC20

    // contract.ontransfer = handler
    contract.on("Transfer", handler)
    handlers.push(handler)
  })

  return () => {
    handlers.forEach(handler => provider.removeListener(address, handler))
  }
}
