import type { SettingsState } from '../../types/settings'
import { LOCALE } from '../../config/environment'

const initialState = {
  defaultGasLimit: 2100000,
  defaultGasPrice: 1000000000,
  pvtKeyLocked: true,
  locale: LOCALE,
  mode: 'dark',
}

export const initialized = () => {
  const event = (state: SettingsState = initialState) => state
  return event
}

export const defaultGasLimitSet = (defaultGasLimit: number) => {
  const event = (state: SettingsState) => ({
    ...state,
    defaultGasLimit,
  })

  return event
}

export const pvtKeyLockToggled = () => {
  const event = (state: SettingsState) => ({
    ...state,
    pvtKeyLocked: !state.pvtKeyLocked,
  })

  return event
}

export const defaultGasPriceSet = (defaultGasPrice: number) => {
  const event = (state: SettingsState) => ({
    ...state,
    defaultGasPrice,
  })

  return event
}

export const changeLocale = (locale: string) => {
  const event = (state: SettingsState) => ({
    ...state,
    locale,
  })

  return event
}

export const changeMode = (mode: string) => {
  const event = (state: SettingsState) => ({
    ...state,
    mode,
  })

  return event
}

export default function model(state: SettingsState) {
  return {
    defaultGasPrice: () => state.defaultGasPrice,
    defaultGasLimit: () => state.defaultGasLimit,
    pvtKeyLocked: () => state.pvtKeyLocked,
    gasSettings: () => ({
      defaultgasPrice: state.defaultGasPrice,
      defaultGasLimit: state.defaultGasLimit,
    }),
    getLocale: () => state.locale,
    getMode: () => state.mode,
  }
}
