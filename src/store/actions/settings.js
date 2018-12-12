const actionTypes = {
  togglePvtKeyLock: 'settings/TOGGLE_PVTKEY_LOCK',
  changeLocale: 'settings/CHANGE_LOCALE',
}

export function togglePvtKeyLock() {
  return {
    type: actionTypes.togglePvtKeyLock,
  }
}

export function changeLocale(locale: string) {
  return {
    type: actionTypes.changeLocale,
    payload: locale,
  }
}

export default actionTypes
