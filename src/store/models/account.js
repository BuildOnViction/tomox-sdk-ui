import { getAccountDomain } from '../domains'

export default function createSelector(state: State) {
    const accountDomain = getAccountDomain(state)
    const address = accountDomain.address()

    return {
      address,
    }
  }