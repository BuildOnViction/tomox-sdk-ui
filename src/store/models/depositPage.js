import BigNumber from 'bignumber.js'
import { push } from 'connected-react-router'

import {
    getTokenDomain,
    getAccountBalancesDomain,
    getTokenPairsDomain,
    getAccountDomain,
    getDepositDomain,
} from '../domains'
import * as actionCreators from '../actions/depositPage'
import { amountPrecision } from '../../config/tokens'

export default function depositPageSelector(state: State) {
    const accountDomain = getAccountDomain(state)
    const userAddress = accountDomain.address()
    const authenticated = accountDomain.authenticated()
    const tokensBalance = getAccountBalancesDomain(state).balances()
    const tokenPairs = getTokenPairsDomain(state).getPairs()
    let tokens = getTokenDomain(state).tokens()

    tokens = tokens
                .filter(token => token.verified)
                .map((token, index) => {
                    const pairs = tokenPairs.filter(pair => pair.includes(token.symbol))
                    return {...token, ...tokensBalance[token.symbol], rank: index + 1, pairs}
                })

    let depositHistory = JSON.parse(JSON.stringify(getDepositDomain(state).getData()))
    depositHistory = depositHistory.map(deposit => {
        const token = tokens.find(token => token.symbol === deposit.coin)
        const decimals = token ? token.decimals : amountPrecision
        deposit.amount = BigNumber(deposit.amount).dividedBy(10**decimals).toFixed(8)
        deposit.scanUrl = token.explorerUrl

        return deposit
    })

    return {
        tokens,
        userAddress,
        depositHistory,
        authenticated,
    }
}

export const getBridgeTokenConfig = (): ThunkAction => {
    return async (dispatch, getState, { api }) => {
        const { swapCoin } = await api.getBridgeTokenConfig()
        dispatch(actionCreators.updateBridgeTokenConfig(swapCoin))
    }
}

export const getBridgeDepositAddress = (payload): ThunkAction => {
    return async (dispatch, getState, { api }) => {
        const { address, coin } = await api.getBridgeDepositAddress(payload)
        dispatch(actionCreators.updateBridgeDepositAddress({ depositAddress: address, coin }))
    }
}

export const getBridgeDepositHistory = (address: string): ThunkAction => {
    return async (dispatch, getState, { api }) => {
        const result = await api.getBridgeDepositHistory(address)
        
        const data = result.Data.map(item => {
            return {
                coin: item.InTx.CoinType,
                amount: item.InTx.Amount,
                status: item.InTx.Status.toUpperCase() === 'DEPOSITED' ? 'COMPLETED' : 'PROCESSING',
                txHash: item.InTx.Hash,
                confirmations: item.InTx.Confirmations,
                date: item.CreatedAt,
                depositAddress: item.InTx.To,
            }
        })

        dispatch(actionCreators.updateRecentHistory({ data, total: result.total }))
    }
}

export const updateCurrentPair = (pairName: string): ThunkAction => {
    return async (dispatch, getState) => {
        const state = getState()
        const tokenPairsDomain = getTokenPairsDomain(state)
        const pairs = tokenPairsDomain.getPairsByCode()
        const pair = pairs[pairName]
        if (!pair) return

        const param = pairName.replace('/', '-')        
        dispatch(actionCreators.updateCurrentPair(pair))
        dispatch(push(`/trade/${param}`))
    }
  }