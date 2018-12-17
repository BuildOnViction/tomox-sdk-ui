import { DEFAULT_NETWORK_ID } from './environment.js'
import addresses from './addresses.json'
import images from './images.json'

export const defaultDecimals = 18

export const defaultTokenDecimals = {
  AE: 18,
  AION: 18,
  BAT: 18,
  BTM: 18,
  DAI: 18,
  DGX: 18,
  FUN: 18,
  GNT: 18,
  KCS: 18,
  KNC: 18,
  LOOM: 18,
  LRC: 18,
  MITH: 18,
  MKR: 18,
  NPXS: 18,
  OMG: 18,
  PPT: 18,
  PRFT: 18,
  REP: 18,
  SNT: 18,
  TOMO: 18,
  TRX: 18,
  WETH: 18,
  WTC: 18,
  ZRX: 18,
}

const tokensBySymbolTable = {
  [DEFAULT_NETWORK_ID]: {},
}

for (const token in addresses[DEFAULT_NETWORK_ID]) {
  if (token !== 'Exchange') {
    tokensBySymbolTable[DEFAULT_NETWORK_ID][token] = {
      symbol: token,
      address: addresses[DEFAULT_NETWORK_ID][token],
      decimals: defaultTokenDecimals[token] || defaultDecimals,
      image: images[DEFAULT_NETWORK_ID][token],
    }
  }
}

export const tokensBySymbol = tokensBySymbolTable[DEFAULT_NETWORK_ID]
export const tokenSymbols = Object.keys(tokensBySymbol)
export const tokens = Object.values(tokensBySymbol)
export const tokenImages = images[DEFAULT_NETWORK_ID]

export const pricePrecision = 7
export const amountPrecision = 3

export const NATIVE_TOKEN = 'TOMO'
