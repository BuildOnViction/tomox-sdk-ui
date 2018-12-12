// @flow
import { getSettingsDomain, getAccountDomain } from '../domains';

import type { State } from '../../types';

export default function settingsPageSelector(state: State) {
  return {
    pvtKeyLocked: getSettingsDomain(state).pvtKeyLocked(),
    authenticated: getAccountDomain(state).authenticated()
  };
}
