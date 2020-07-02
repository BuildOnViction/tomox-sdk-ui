const actionTypes = {
    updateBridgeTokenConfig: 'withdrawPage/UPDATE_BRIDGE_TOKEN_CONFIG',
    updateRecentHistory: 'withdrawPage/UPDATE_RECENT_HISTORY',
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

export default actionTypes