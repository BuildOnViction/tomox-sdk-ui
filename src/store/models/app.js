import { getAccountDomain } from '../domains'

export default function createSelector(state) {
    const accountDomain = getAccountDomain(state)

    return {
        location: state.router.location.pathname,
        authenticated: accountDomain.authenticated(),
    }
}