require('dotenv').config()
const _ = require('lodash')
const fs = require('fs')
const utils = require('ethers').utils
const {providers, Contract} = require('ethers')

const {Token, RelayerRegistration} = require('../utils/abis')
const NATIVE_TOKEN_SYMBOL = 'TOMO'
const NATIVE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000001'

const coinbaseAddress = process.env.COINBASE_ADDRESS
const relayerRegistrationContractAddress = process.env.RELAYER_REGISTRATION_CONTRACT_ADDRESS
const rpcUrl = process.env.RPC_URL

if (!coinbaseAddress || !relayerRegistrationContractAddress || !rpcUrl) {
  console.log('Please update .env file')
  return
}

const provider = new providers.JsonRpcProvider(process.env.RPC_URL)

const relayerRegistrationContract = new Contract(
  relayerRegistrationContractAddress,
  RelayerRegistration,
  provider,
)

const result = {
  tokens: {},
  pairs: [],
}

const queryRelayerRegistrationContract = async () => {

  const data = await relayerRegistrationContract.getRelayerByCoinbase(coinbaseAddress)

  const makeFee = data[2]
  const takeFee = data[3]
  const fromTokens = data[4]
  const toTokens = data[5]

  const tokens = _.union(fromTokens, toTokens)

  // If there is no token, return immediately
  if (tokens.length === 0) {
    console.log("There is no token")
    return
  }

  if (fromTokens.length !== toTokens.length) {
    console.log("Smart contract returned values are not correct.")
    return
  }

  // Get tokens data
  for (const token of tokens) {
    const tokenContract = new Contract(
      token,
      Token,
      provider,
    )

    const name = await tokenContract.name()
    const symbol = await tokenContract.symbol()
    const decimals = await tokenContract.decimals()

    result.tokens[utils.getAddress(token)] = {
      name,
      symbol,
      decimals,
      makeFee: makeFee.toString(),
      takeFee: takeFee.toString(),
    }
  }

  // Get pairs data
  for (let i = 0; i < fromTokens.length; i++) {
    const normalizedFromToken = utils.getAddress(fromTokens[i])
    const normalizedToToken = utils.getAddress(toTokens[i])

    // Pair will have the format "ETH/TOMO" for example
    result.pairs.push(`${result.tokens[normalizedFromToken].symbol}/${result.tokens[normalizedToToken].symbol}`)
  }

  for (const address in result.tokens) {
    if (result.tokens[address].symbol === NATIVE_TOKEN_SYMBOL) {
      result.tokens[NATIVE_TOKEN_ADDRESS] = result.tokens[address]
      delete result.tokens[address]
      break
    }
  }

  console.log(result)
  fs.writeFileSync(
    'src/config/addresses.json',
    JSON.stringify(result, null, 2),
    'utf8',
  )
}

queryRelayerRegistrationContract()
