const actionTypes = {
    updateBridgeTokenConfig: 'withdrawPage/UPDATE_BRIDGE_TOKEN_CONFIG',
    updateRecentHistory: 'withdrawPage/UPDATE_RECENT_HISTORY',
    updateWithdrawalHash: 'withdrawPage/UPDATE_WITHDRAWAL_HASH',
}

export function updateBridgeTokenConfig(config: Array<Object>) {
    return {
        type: actionTypes.updateBridgeTokenConfig,
        payload: config,
    }
}

export function updateRecentHistory(withdraw: Object) {
    return {
        type: actionTypes.updateRecentHistory,
        payload: {
            data: withdraw.data,
            total: withdraw.total,
        },
    }
}

export function updateWithdrawalHash(hash: string) {
    return {
        type: actionTypes.updateWithdrawalHash,
        payload: {
            hash,
        },
    }
}

export default actionTypes