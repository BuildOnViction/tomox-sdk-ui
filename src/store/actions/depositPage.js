const actionTypes = {
    updateBridgeTokenConfig: 'depositPage/UPDATE_BRIDGE_TOKEN_CONFIG',
    updateBridgeDepositAddress: 'depositPage/UDPATE_BRIDGE_DEPOSIT_ADDRESS',
    updateRecentHistory: 'depositPage/UPDATE_RECENT_HISTORY',
    updateCurrentPair: 'depositPage/UDPATE_CURRENT_PAIR',
}

export function updateBridgeTokenConfig(config: Array<Object>) {
    return {
        type: actionTypes.updateBridgeTokenConfig,
        payload: config,
    }
}

export function updateBridgeDepositAddress(data: Array<Object>) {
    return {
        type: actionTypes.updateBridgeDepositAddress,
        payload: data,
    }
}

export function updateRecentHistory(deposit: Object) {
    return {
        type: actionTypes.updateRecentHistory,
        payload: {
            data: deposit.data,
            total: deposit.total,
        },
    }
}

export function updateCurrentPair(pair) {
    return {
        type: actionTypes.updateCurrentPair,
        payload: { pair },
    }
}

export default actionTypes