const actionTypes = {
  togglePvtKeyLock: 'settings/TOGGLE_PVTKEY_LOCK',
  changeLocale: 'settings/CHANGE_LOCALE',
  changeMode: 'settings/CHANGE_MODE',
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

export function changeMode(mode: string) {
  return {
    type: actionTypes.changeMode,
    payload: mode,
  }
}

export default actionTypes
