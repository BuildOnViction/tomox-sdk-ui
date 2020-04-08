// @flow
import BigNumber from 'bignumber.js'
import type {
  AccountBalances,
  AccountBalancesState,
} from '../../types/accountBalances'
import { round } from '../../utils/helpers'
import { NATIVE_TOKEN_SYMBOL, pricePrecision } from '../../config/tokens'
import { parseBalance } from '../../utils/parsers'

export function initialized() {
  const initialState = {}
  const event = (state: AccountBalancesState = initialState) => state

  return event
}

export function subscribed(symbol: string) {
  const event = (state: AccountBalancesState) => ({
    ...state,
    [symbol]: {
      balance: state[symbol] ? state[symbol].balance : null,
      symbol,
      subscribed: true,
    },
  })
  return event
}

export function updated(accountBalances: AccountBalances) {
  const event = (state: AccountBalancesState) => {
    const newState = {}

    for (const key in accountBalances) {
      const { balance, availableBalance, inOrderBalance, decimals, symbol } = accountBalances[key]      
      const tokenBalance = {
        balance: parseBalance(balance, decimals),
        inOrders: parseBalance(inOrderBalance, decimals),
        availableBalance: parseBalance(availableBalance, decimals),
        symbol,
        address: key,
        decimals,
      }
      newState[symbol] = tokenBalance
    }

    return {
      ...state,
      ...newState,
    }
  }

  return event
}

export function unsubscribed(symbol: string) {
  const event = (state: AccountBalancesState) => ({
    ...state,
    [symbol]: {
      ...state[symbol],
      subscribed: false,
    },
  })

  return event
}

export function reset() {
  const event = _ => ({})

  return event
}

export default function accountBalancesDomain(state: AccountBalancesState) {
  return {
    balances(): AccountBalancesState {
      return state
    },
    loading(): boolean {
      return !(state[NATIVE_TOKEN_SYMBOL])
    },
    formattedBalances(): * {
      const keys = Object.keys(state)
      const formattedBalances = {}

      keys.forEach(key => {
        formattedBalances[key] = BigNumber(state[key].balance).toFormat(pricePrecision)
      })

      return formattedBalances
    },
    tokenChartBalances(): * {
      const keys = Object.keys(state)
      const numericBalances = []

      keys.forEach(key => {
        const value = round(state[key].balance)
        if (value !== 0) numericBalances.push({ symbol: key, value })
      })

      return numericBalances
    },
    tomoBalance(): ?string {
      return state[NATIVE_TOKEN_SYMBOL]
        ? state[NATIVE_TOKEN_SYMBOL].balance
        : null
    },
    formattedTomoBalance(): ?string {
      return state[NATIVE_TOKEN_SYMBOL]
        ? BigNumber(state[NATIVE_TOKEN_SYMBOL].balance).toFormat(pricePrecision)
        : null
    },
    tokenBalance(symbol: string): ?string {
      if (!state[symbol]) {
        return {
          balance: null,
          inOrders: null,
          availableBalance: null,
        }
      }

      const balance = state[symbol].balance
      const inOrders = state[symbol].inOrders
      const availableBalance = state[symbol].availableBalance
      
      return {
        balance,
        inOrders,
        availableBalance,
      }
    },
    numericTokenBalance(symbol: string): ?number {
      return state[symbol] ? Number(state[symbol].balance) : null
    },
    formattedTokenBalance(symbol: string) {
      return state[symbol]
        ? BigNumber(state[symbol].balance).toFormat(pricePrecision)
        : null
    },
    getBigNumberBalance(symbol: string) {
      if (!state[symbol]) return null
      //The precision multiplier allows for rounding a decimal balance to a "point" number that
      //can be converted into a bignumber. After the bignumber balance is computed, we divide by
      //the precisionMultiplier to offset the initial multiplication by the precision multiplier
      const precisionMultiplier = Math.pow(10, pricePrecision)
      const balancePoints = BigNumber(state[symbol].balance).times(precisionMultiplier).toFixed(0)
      const tomoMultiplier = Math.pow(10, state[symbol].decimals)

      const balance = BigNumber(balancePoints)
        .times(tomoMultiplier)
        .div(precisionMultiplier)

      return balance
    },
    get(symbol: string): ?string {
      return state[symbol] ? state[symbol].balance : null
    },
    isSubscribed(symbol: string): boolean {
      return state[symbol] ? state[symbol].subscribed : false
    },
    getBalancesAndAllowances(tokens: Array<Object>) {
      if (!tokens) return tokens

      return (tokens: any).map(token => {
        return {
          ...token,
          balance: state[token.symbol]
            ? state[token.symbol].balance
            : null,
          inOrders: state[token.symbol]
            ? state[token.symbol].inOrders
            : null,
          availableBalance: state[token.symbol]
            ? state[token.symbol].availableBalance
            : null,
        }
      })
    },
    getBalancesAndAllowancesBySymbol(symbols: Array<string>) {
      return (symbols: any).map(symbol => {
        if (!state[symbol]) {
          return {
            balance: null,
            inOrders: null,
            availableBalance: null,
          }
        }

        const balance = state[symbol].balance
        const inOrders = state[symbol].inOrders
        const availableBalance = state[symbol].availableBalance

        return {
          balance,
          inOrders,
          availableBalance,
        }
      })
    },
    depositTableData() {
      return (Object.values(state): any).map(item => {
        return {
          symbol: item.symbol,
          balance: BigNumber(item.balance).toFormat(pricePrecision),
        }
      })
    },
    balancesArray() {
      return (Object.values(state): any).map(item => {
        return {
          symbol: item.symbol,
          balance: BigNumber(item.balance).toFormat(pricePrecision),
        }
      })
    },
  }
}
