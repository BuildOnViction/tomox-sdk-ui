require('dotenv').config()
const _ = require('lodash')
const fs = require('fs')
const utils = require('ethers').utils
const {providers, Contract} = require('ethers')

const {Token, RelayerRegistration} = require('../utils/abis')

const coinbaseAddress = process.env.COINBASE_ADDRESS
const networkId = process.env.REACT_APP_DEFAULT_NETWORK_ID
const relayerRegistrationContractAddress = process.env.RELAYER_REGISTRATION_CONTRACT_ADDRESS
const rpcUrl = process.env.RPC_URL

const result = {
  [networkId]: {},
}

const queryRelayerRegistrationContract = async () => {

  if (!coinbaseAddress || !relayerRegistrationContractAddress || !rpcUrl) {
    console.log('Please update .env file')
    return
  }

  const provider = new providers.JsonRpcProvider(rpcUrl)

  const relayerRegistrationContract = new Contract(
    relayerRegistrationContractAddress,
    RelayerRegistration,
    provider,
  )

  const data = await relayerRegistrationContract.getRelayerByCoinbase(coinbaseAddress)

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

    result[networkId][name] = utils.getAddress(token)
  }

  fs.writeFileSync(
    'src/config/addresses.json',
    JSON.stringify(result, null, 2),
    'utf8',
  )
}

queryRelayerRegistrationContract()
