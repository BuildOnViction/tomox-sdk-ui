// @flow
import type {
  AccountAllowances,
  AccountBalances,
  AccountBalancesState,
} from '../../types/accountBalances'
import { round } from '../../utils/helpers'
import { utils } from 'ethers'
import { ALLOWANCE_MINIMUM } from '../../utils/constants'
import { formatNumber } from 'accounting-js'
import { NATIVE_TOKEN_SYMBOL } from '../../config/tokens'
// eslint-disable-next-line
const initialState = {}

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
    const newState = accountBalances.reduce((result, item) => {
      result[item.symbol] = {
        ...state[item.symbol],
        symbol: item.symbol,
        balance: item.balance,
        subscribed: state[item.symbol] ? state[item.symbol].subscribed : false,
      }
      return result
    }, {})

    return {
      ...state,
      ...newState,
    }
  }

  return event
}

export function allowancesUpdated(allowances: AccountAllowances) {
  const event = (state: AccountBalancesState) => {
    const newState = allowances.reduce((result, item) => {
      result[item.symbol] = {
        ...state[item.symbol],
        symbol: item.symbol,
        allowance: item.allowance,
      }
      return result
    }, {})
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

export function cleared() {
  const event = (state: AccountBalancesState) => {}
  return event
}

export default function accountBalancesDomain(state: AccountBalancesState) {
  return {
    balances(): AccountBalancesState {
      return state
    },
    // we assume that account balances are loading as long as we have no TOMO and no WETH state.
    loading(): boolean {
      return !(state[NATIVE_TOKEN_SYMBOL])
    },
    formattedBalances(): * {
      const keys = Object.keys(state)
      const formattedBalances = {}

      keys.forEach(key => {
        formattedBalances[key] = formatNumber(state[key].balance, {
          precision: 2,
        })
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
        ? formatNumber(state[NATIVE_TOKEN_SYMBOL].balance, { precision: 2 })
        : null
    },
    tokenBalance(symbol: string): ?string {
      return state[symbol] ? state[symbol].balance : null
    },
    tokenAllowance(symbol: string): ?string {
      return state[symbol] ? state[symbol].allowance : null
    },
    numericTokenBalance(symbol: string): ?number {
      return state[symbol] ? Number(state[symbol].balance) : null
    },
    numericTokenAllowance(symbol: string): ?number {
      return state[symbol] ? Number(state[symbol].allowance) : null
    },
    formattedTokenBalance(symbol: string) {
      return state[symbol]
        ? formatNumber(state[symbol].balance, { precision: 2 })
        : null
    },
    getBigNumberBalance(symbol: string) {
      if (!state[symbol]) return null
      //The precision multiplier allows for rounding a decimal balance to a "point" number that
      //can be converted into a bignumber. After the bignumber balance is computed, we divide by
      //the precisionMultiplier to offset the initial multiplication by the precision multiplier
      const precisionMultiplier = 1e4
      const numericBalance = Number(state[symbol].balance)
      const balancePoints = round(numericBalance * precisionMultiplier, 0)

      const etherMultiplier = utils.bigNumberify('1000000000000000000')
      const balance = utils
        .bigNumberify(balancePoints)
        .mul(etherMultiplier)
        .div(utils.bigNumberify(precisionMultiplier))

      return balance
    },
    get(symbol: string): ?string {
      return state[symbol] ? state[symbol].balance : null
    },
    isSubscribed(symbol: string): boolean {
      return state[symbol] ? state[symbol].subscribed : false
    },
    isAllowed(symbol: string): boolean {
      return state[symbol] ? state[symbol].allowance > ALLOWANCE_MINIMUM : false
    },
    isAllowancePending(symbol: string): boolean {
      return state[symbol] ? state[symbol].allowance === 'pending' : false
    },
    //To simply UX, we suppose that a trader is "allowing" the exchange smart contract to trade tokens if the
    //allowance value is set to a very large number. If the allowance is above ALLOWANCE_MINIMUM, the tokens is
    //is considered tradeable on the frontend app.
    getBalancesAndAllowances(tokens: Array<Object>) {
      return (tokens: any).map(token => {
        return {
          ...token,
          balance: state[token.symbol]
            ? formatNumber(state[token.symbol].balance, { precision: 2 })
            : null,
          allowed:
            state[token.symbol] &&
            state[token.symbol].allowance > ALLOWANCE_MINIMUM,
          allowancePending:
            state[token.symbol] && state[token.symbol].allowance === 'pending',
        }
      })
    },
    getBalancesAndAllowancesBySymbol(symbols: Array<string>) {
      return (symbols: any).map(symbol => {
        if (!state[symbol]) {
          return {
            balance: null,
            allowed: null,
            allowancePending: null,
          }
        }

        const balance = state[symbol].balance
        const allowance = state[symbol].allowance
        const allowed = Number(allowance) >= Math.max(Number(balance), 100000)

        return {
          balance,
          allowed,
          allowancePending: state[symbol].allowancePending,
        }
      })
    },
    depositTableData() {
      return (Object.values(state): any).map(item => {
        return {
          symbol: item.symbol,
          balance: formatNumber(item.balance, { precision: 2 }),
          allowed: item.allowance > ALLOWANCE_MINIMUM,
          allowancePending: item.allowance === 'pending',
        }
      })
    },
    balancesArray() {
      return (Object.values(state): any).map(item => {
        return {
          symbol: item.symbol,
          balance: formatNumber(item.balance, { precision: 2 }),
          allowed: item.allowance > ALLOWANCE_MINIMUM,
        }
      })
    },
  }
}
