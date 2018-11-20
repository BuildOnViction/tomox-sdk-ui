//@flow
export type Symbol = string;

export type TokenImage = {
  meta: string,
  url: string
};

export type Token = {
  address: string,
  symbol: Symbol,
  decimals: number,
  image: TokenImage
};

export type TokenBalance = {
  symbol: Symbol,
  balance: number
};

export type Tokens = Array < Token > ;
export type TokenBalances = Array < TokenBalance > ;

export type RankedToken = {
  address: string,
  symbol: string,
  decimals: number,
  rank: number
};

export type TokenPair = {+pair: string,
  +baseTokenDecimals: number,
  +quoteTokenDecimals: number,
  +baseTokenSymbol: string,
  +quoteTokenSymbol: string,
  +baseTokenAddress: string,
  +quoteTokenAddress: string,
  +decimalsMultiplier: number,
  +pricepointMultiplier: number
};



export type TokenData = {
  address: string,
  symbol: Symbol,
  balance: string,
  allowance: string,
  allowed: boolean,
  allowancePending: boolean,
  image: TokenImage
};

export type TokenPairData = {
  pair: string,
  lastPrice: ? number,
  change: ? number,
  high: ? number,
  low: ? number,
  volume: ? number,
  base: ? string,
  quote: ? string,
  favorited: ? string
};

export type TokenPairDataArray = Array < TokenPairData > ;
// export type TokenPairDataMap = { [string]: TokenPairData };
export type TokenPairDataMap = Array < TokenPairData > ;

export type TokenState = {+symbols: Array < Symbol > ,
  +bySymbol: {
    [Symbol]: Token
  }
};

export type TokenPairState = {+byPair: {+[string]: {+pair: string,
      +baseTokenSymbol: string,
      +quoteTokenSymbol: string,
      +baseTokenAddress: string,
      +quoteTokenAddress: string,
      +decimalsMultiplier: number,
      +pricepointMultiplier: number
    }
  },
  +data: Array < TokenPairData > ,
  +favorites: Array < string > ,
  +currentPair: string
};

export type TokenEvent = any => TokenState => TokenState;
export type TokenPairEvent = any => TokenPairState => TokenPairState;