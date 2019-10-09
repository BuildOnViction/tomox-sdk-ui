// @flow
import toDecimalFormString from 'number-to-decimal-form-string-x'
import BigNumber from 'bignumber.js'
import type {
  AccountBalances,
  AccountBalancesState,
} from '../../types/accountBalances'
import { round } from '../../utils/helpers'
import { utils } from 'ethers'
import { NATIVE_TOKEN_SYMBOL, pricePrecision } from '../../config/tokens'

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
      let inOrders = item.inOrders ? item.inOrders : (state[item.symbol] ? state[item.symbol].inOrders : 0)

      result[item.symbol] = {
        ...state[item.symbol],
        symbol: item.symbol,
        balance: item.balance,
        inOrders,
        availableBalance: BigNumber(item.balance).minus(inOrders).toFixed(pricePrecision),
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
      return state[symbol] ? state[symbol].balance : null
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
      const precisionMultiplier = 1e4
      const numericBalance = Number(state[symbol].balance)
      const balancePoints = round(numericBalance * precisionMultiplier, 0)

      const etherMultiplier = utils.bigNumberify('1000000000000000000')
      const balance = utils
        .bigNumberify(toDecimalFormString(balancePoints))
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
    getBalancesAndAllowances(tokens: Array<Object>) {
      return (tokens: any).map(token => {
        return {
          ...token,
          balance: state[token.symbol]
            ? BigNumber(state[token.symbol].balance).toFormat(pricePrecision)
            : null,
          inOrders: state[token.symbol]
            ? BigNumber(state[token.symbol].inOrders).toFormat(pricePrecision)
            : null,
          availableBalance: state[token.symbol]
            ? BigNumber(state[token.symbol].availableBalance).toFormat(pricePrecision)
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
