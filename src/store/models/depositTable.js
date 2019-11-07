//@flow
import getAccountBalancesDomain from '../domains'

import type { State } from '../../types'

export default function getDepositTableSelector(state: State) {
  const accountBalancesModel = getAccountBalancesDomain(state)

  return accountBalancesModel
}
