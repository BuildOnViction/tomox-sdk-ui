import { getAccountDomain } from '../domains'
import * as appActionCreators from '../actions/app'

export default function createSelector(state) {
    const accountDomain = getAccountDomain(state)

    return {
        location: state.router.location.pathname,
        authenticated: accountDomain.authenticated(),
    }
}

export function copyDataSuccess() {
    return (dispatch) => {
        dispatch(appActionCreators.copyDataSuccessNotification())
    }
}