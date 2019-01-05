import { isEthereumAddress } from '../../../utils/crypto'
import { isJson } from '../../../utils/helpers'

export const loadValue = key => {
  try {
    const value = localStorage.getItem(key)

    return value
  } catch (err) {
    console.log(err)
  }
}

export const setValue = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch (err) {
    console.log(err)
  }
}

export const setShowHelpModalSetting = value => {
  setValue('showHelpModal', value)
}

export const loadShowHelpModalSetting = () => {
  const value = loadValue('showHelpModal')

  if (value === null || value === 'true') {
    return true
  }
    return false

}

export const getLocalStorageWallets = () => {
  const wallets = []
  let index = 1

  Object.keys(localStorage).map(key => {
    if (isEthereumAddress(key) && isJson(localStorage[key])) {
      wallets.push({
        address: key,
        encryptedWallet: localStorage[key],
        rank: index,
      })
      index++
    }

    return key
  })

  return wallets
}
