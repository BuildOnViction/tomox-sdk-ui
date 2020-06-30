import BigNumber from 'bignumber.js'
import { Contract } from 'ethers'

import TRC21MULTISIG from '../../config/TRC21-MULTISIG.json'
import { getSigner } from '../services/signer'
import {
    getTokenDomain,
    getAccountBalancesDomain,
    getTokenPairsDomain,
    getAccountDomain,
    getWithDrawDomain,
} from '../domains'
import * as actionCreators from '../actions/withdrawPage'
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

    let withdrawHistory = JSON.parse(JSON.stringify(getWithDrawDomain(state).getData()))
    withdrawHistory = withdrawHistory.map(deposit => {
        const token = tokens.find(token => token.symbol === deposit.coin)
        const decimals = token ? token.decimals : amountPrecision
        deposit.amount = BigNumber(deposit.amount).dividedBy(10**decimals).toFixed(8)
        deposit.scanUrl = token.explorerUrl

        return deposit
    })

    return {
        tokens,
        userAddress,
        withdrawHistory,
        authenticated,
    }
}

export const getBridgeTokenConfig = (): ThunkAction => {
    return async (dispatch, getState, { api }) => {
        const { swapCoin } = await api.getBridgeTokenConfig()
        dispatch(actionCreators.updateBridgeTokenConfig(swapCoin))
    }
}

export const getBridgeWithdrawHistory = (address: string): ThunkAction => {
    return async (dispatch, getState, { api }) => {
        const result = await api.getBridgeWithdrawHistory(address)
        
        const data = result.Data.map(item => {
            return {
                coin: item.InTx.CoinType.replace('TOMO', ''),
                amount: item.InTx.Amount,
                status: item.OutTx.Status.toUpperCase() === 'WITHDRAWED' ? 'COMPLETED' : 'PROCESSING',
                txHash: item.OutTx.Hash,
                // confirmations: result.Data[i].OutTx.Confirmations,
                date: item.CreatedAt,
                withdrawalAddress: item.InTx.To,
            }
        })
        // const data = []

        // for (let i = 0; i < result.Data.length; i++) {
        //     if (!result.Data[i].OutTx.Hash) continue

        //     const item = {
        //         coin: result.Data[i].InTx.CoinType.replace('TOMO', ''),
        //         amount: result.Data[i].InTx.Amount,
        //         status: result.Data[i].OutTx.Status.toUpperCase() === 'WITHDRAWED' ? 'COMPLETED' : 'PROCESSING',
        //         txHash: result.Data[i].OutTx.Hash,
        //         // confirmations: result.Data[i].OutTx.Confirmations,
        //         date: result.Data[i].CreatedAt,
        //         withdrawalAddress: result.Data[i].InTx.To,
        //     }

        //     data.push(item)
        // }

        dispatch(actionCreators.updateRecentHistory({ data, total: result.total }))
    }
}

function string2byte(str) {
    let byteArray = []
    for (let j = 0; j < str.length; j++) {
        byteArray.push(str.charCodeAt(j))
    }
    return byteArray
}

export const withdrawToken = ({ contractAddress, receiverAddress, withdrawalAmount, tokenDecimals }): ThunkAction => {
    return async (dispatch, getState) => {
        const signer = getSigner()
        const contract = new Contract(contractAddress, TRC21MULTISIG.abi, signer)
        const amount = BigNumber(withdrawalAmount).multipliedBy(10**tokenDecimals).toFixed(0)
        const to = string2byte(receiverAddress)

        await contract.burn(
            amount,
            to,
            {
                gasLimit: 2000000,
                gasPrice: 250000000,
            }
        )
    }
}