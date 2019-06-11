// @flow
import { connect } from 'react-redux'

import getLoginPageSelector, {
    getTrezorPublicKey,
    loginWithTrezorWallet,
    getBalance,
} from '../../store/models/loginPage'

import type { State } from '../../types'

export const mapStateToProps = (state: State) => {
    const loginPageSelector = getLoginPageSelector(state)

    return {
        loading: loginPageSelector.loading,
        publicKeyData: loginPageSelector.getPublicKeyData(),
    }
}

export const mapDispatchToProps = {
    getTrezorPublicKey,
    loginWithTrezorWallet,
    getBalance,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)
