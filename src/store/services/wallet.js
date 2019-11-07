import { Wallet } from 'ethers'
import { getProvider } from './signer'

export const getDefaultWalletAddress = () => {
  return '0xe8e84ee367bc63ddb38d3d01bccef106c194dc47'
}

export const getDefaultPrivateKey = () => {
  return ''
}

export const getCurrentBlock = async () => {
  const provider = getProvider()
  const block = await provider.getBlock()
  return block.number
}

/**
 * @description Generates a brain wallet from a username/password pair
 * @param username [String]
 * @param password [String]
 * @returns [Object] - TOMOs.js wallet object
 */
export const generateBrainWalletPrivateKey = async (username, password) => {
  const wallet = await Wallet.fromBrainWallet(username, password)
  return wallet
}

/**
 * @description Creates a random (unencrypted) ethers.js wallet object
 * @returns [Object] - TOMOs.js wallet object
 */
export const createRandomWallet = async () => {
  const wallet = await Wallet.createRandom()
  return wallet
}

/**
 * @description Creates an (unencrypted) ethers.js wallet object
 * @param privateKey [String]
 * @returns [Object] - TOMOs.js wallet object
 */
export const createWalletFromPrivateKey = privateKey => {
  let wallet
  try {
    wallet = new Wallet(privateKey)
  } catch (e) {
    console.log(e)
  }
  return { wallet }
}

export const getEncryptedWalletAddress = encryptedWallet => {
  const json = JSON.parse(encryptedWallet)
  const address = '0x' + json.address

  return address
}

export const createWalletFromJSON = async (
  encryptedWallet,
  password,
  progressCallback
) => {
  let wallet
  try {
    // console.log(encryptedWallet, password);
    wallet = await Wallet.fromEncryptedJson(
      encryptedWallet,
      password,
      progressCallback
    )
  } catch (e) {
    console.log(e)
  }
  return { wallet, encryptedWallet }
}

export const createWalletFromMnemonic = async (mnemonic, path = "m/44'/889'/0'/0/", addressIndex = 0) => {
  let wallet

  try {
    wallet = await Wallet.fromMnemonic(mnemonic, `${path}${addressIndex}`)
  } catch (e) {
    console.log(e)
  }

  return { wallet }
}

/**
 * @description Creates an encrypted ethers.js wallet object and returns it
 * along with it's address
 * @param password [String]
 * @returns [Object] - TOMOs.js encrypted wallet and wallet address
 */
export const createAndEncryptWallet = async (password, callback) => {
  const wallet = await Wallet.createRandom()
  const address = wallet.address
  const encryptedWallet = await wallet.encrypt(password, callback)
  return { address, encryptedWallet }
}

/**
 * @description Decrypts an ethers.js wallet object and returns the plain decrypted object
 * @param jsonWallet [Object]
 * @param password
 * @returns [Object] - TOMOs.js wallet
 */
export const decryptWallet = async (jsonWallet, password) => {
  const wallet = await Wallet.fromEncryptedWallet(jsonWallet, password)
  return wallet
}

export const saveWalletInSessionStorage = wallet => {
  const address = wallet.address
  const privateKey = wallet.privateKey
  sessionStorage.setItem(address, privateKey)
}

export const getWalletFromSessionStorage = address => {
  const privateKey = sessionStorage.getItem(address)
  const wallet = new Wallet(privateKey)
  return wallet
}

export const saveEncryptedWalletInLocalStorage = (address, encryptedWallet) => {
  localStorage.setItem(address, encryptedWallet)
}

export const getEncryptedWalletFromLocalStorage = address => {
  const encryptedWallet = localStorage.getItem(address)
  return encryptedWallet
}

