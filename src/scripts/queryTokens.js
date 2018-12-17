// import fs from 'fs';
// import process from 'process'
// import path from 'path'
// import { rand, randInt } from '../utils/helpers';
// import tokenPairs from '../jsons/tokenPairs.json';
// import { utils } from 'ethers';

const fs = require('fs')
const path = require('path')
const utils = require('ethers').utils
const program = require('commander')

require('dotenv').load()

program
  .version('0.1.0')
  .option('-p, --truffle-build-path [value]', 'Truffle build path')
  .parse(process.argv)

// console.log('Truffle build path:', program);

const TRUFFLE_BUILD_PATH = path.resolve(
  program.truffleBuildPath || '../dex-smart-contract/build/contracts'
)
const contractConfig = require(path.resolve(TRUFFLE_BUILD_PATH, '../../config'))
const ignoreFilesPattern = /(?:RewardCollector|RewardPools|Migrations|Owned|SafeMath)\.json$/
const networkID = process.env.REACT_APP_DEFAULT_NETWORK_ID || '8888'

const contracts = {
  [networkID]: {},
}
const files = fs.readdirSync(TRUFFLE_BUILD_PATH)

files
  .filter(file => !ignoreFilesPattern.test(file))
  .forEach((file, index) => {
    let address
    let symbol
    const json = JSON.parse(
      fs.readFileSync(`${TRUFFLE_BUILD_PATH}/${file}`, 'utf8')
    )

    if (json.networks[networkID]) {
      symbol = file.slice(0, -5)
      if (symbol === 'WETH9') symbol = 'WETH'
      if (contractConfig.tokens.includes(symbol)) {
        address = json.networks[networkID].address
        contracts[networkID][symbol] = utils.getAddress(address)
      }
    }
  })

console.log(contracts)
fs.writeFileSync(
  'src/config/addresses.json',
  JSON.stringify(contracts, null, 2),
  'utf8'
)
