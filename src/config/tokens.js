import addresses from './addresses.json'
import images from './images.json'

const tokensBySymbolTable = {
  '8888': {
    AE: {
      symbol: 'AE',
      address: addresses['8888']['AE'],
      image: images['8888']['AE']
    },
    AION: {
      symbol: 'AION',
      address: addresses['8888']['AION'],
      image: images['8888']['AION']
    },
    BAT: {
      symbol: 'BAT',
      address: addresses['8888']['BAT'],
      image: images['8888']['BAT']
    },
    TOMO: {
      symbol: 'TOMO',
      address: addresses['8888']['TOMO'],
      image: images['8888']['TOMO']
    },
    BTM: {
      symbol: 'BTM',
      address: addresses['8888']['BTM'],
      image: images['8888']['BTM']
    },
    DGX: {
      symbol: 'DGX',
      address: addresses['8888']['DGX'],
      image: images['8888']['DGX']
    },
    FUN: {
      symbol: 'FUN',
      address: addresses['8888']['FUN'],
      image: images['8888']['FUN']
    },
    GNT: {
      symbol: 'GNT',
      address: addresses['8888']['GNT'],
      image: images['8888']['GNT']
    },
    KCS: {
      symbol: 'KCS',
      address: addresses['8888']['KCS'],
      image: images['8888']['KCS']
    },
    KNC: {
      symbol: 'KNC',
      address: addresses['8888']['KNC'],
      image: images['8888']['KNC']
    },
    LOOM: {
      symbol: 'LOOM',
      address: addresses['8888']['LOOM'],
      image: images['8888']['LOOM']
    },
    LRC: {
      symbol: 'LRC',
      address: addresses['8888']['LRC'],
      image: images['8888']['LRC']
    },
    MITH: {
      symbol: 'MITH',
      address: addresses['8888']['MITH'],
      image: images['8888']['MITH']
    },
    MKR: {
      symbol: 'MKR',
      address: addresses['8888']['MKR'],
      image: images['8888']['MKR']
    },
    NPXS: {
      symbol: 'NPXS',
      address: addresses['8888']['NPXS'],
      image: images['8888']['NPXS']
    },
    OMG: {
      symbol: 'OMG',
      address: addresses['8888']['OMG'],
      image: images['8888']['OMG']
    },
    PPT: {
      symbol: 'PPT',
      address: addresses['8888']['PPT'],
      image: images['8888']['PPT']
    },
    REP: {
      symbol: 'REP',
      address: addresses['8888']['REP'],
      image: images['8888']['REP']
    },
    SNT: {
      symbol: 'SNT',
      address: addresses['8888']['SNT'],
      image: images['8888']['SNT']
    },
    TRX: {
      symbol: 'TRX',
      address: addresses['8888']['TRX'],
      image: images['8888']['TRX']
    },
    WTC: {
      symbol: 'WTC',
      address: addresses['8888']['WTC'],
      image: images['8888']['WTC']
    },
    ZRX: {
      symbol: 'ZRX',
      address: addresses['8888']['ZRX'],
      image: images['8888']['ZRX']
    }
  }
}

const networkID = process.env.REACT_APP_DEFAULT_NETWORK_ID || '8888'
export const tokensBySymbol = tokensBySymbolTable[networkID]
export const tokenSymbols = Object.keys(tokensBySymbol)
export const tokens = Object.values(tokensBySymbol)
