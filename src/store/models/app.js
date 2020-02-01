import { getAccountDomain, getSettingsDomain } from '../domains'
import * as appActionCreators from '../actions/app'

export default function appSelector(state) {
    const accountDomain = getAccountDomain(state)
    const mode = getSettingsDomain(state).getMode()

    return {
        location: state.router.location.pathname,
        authenticated: accountDomain.authenticated(),
        mode,
    }
}

export function copyDataSuccess() {
    return (dispatch) => {
        dispatch(appActionCreators.copyDataSuccessNotification())
    }
}