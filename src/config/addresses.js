import { getTokensAndPairs } from '../../src/store/services/api/engine'

export const getAddresses = async () => {
    const result = await getTokensAndPairs()
    return result
}