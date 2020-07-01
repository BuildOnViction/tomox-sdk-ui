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
    const total = getWithDrawDomain(state).getTotal()

    return {
        tokens,
        userAddress,
        withdrawHistory,
        authenticated,
        total,
    }
}

export const getBridgeTokenConfig = (): ThunkAction => {
    return async (dispatch, getState, { api }) => {
        const { swapCoin } = await api.getBridgeTokenConfig()
        dispatch(actionCreators.updateBridgeTokenConfig(swapCoin))
    }
}

export const getBridgeWithdrawHistory = (address: string, page, limit): ThunkAction => {
    return async (dispatch, getState, { api }) => {
        const result = await api.getBridgeWithdrawHistory(address, page, limit)
        
        const data = result.Data.map(item => {
            return {
                coin: item.InTx.CoinType.replace('TOMO', ''),
                amount: item.InTx.Amount,
                status: item.OutTx.Status.toUpperCase() === 'WITHDRAWED' ? 'COMPLETED' : 'PROCESSING',
                txHash: item.OutTx.Hash,
                date: item.CreatedAt,
                withdrawalAddress: item.InTx.To,
            }
        })

        dispatch(actionCreators.updateRecentHistory({ data, total: result.Total }))
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