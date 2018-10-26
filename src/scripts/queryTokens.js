// import fs from 'fs';
// import process from 'process'
// import path from 'path'
// import { rand, randInt } from '../utils/helpers';
// import tokenPairs from '../jsons/tokenPairs.json';
// import { utils } from 'ethers';

const fs = require('fs')
const path = require('path')
const utils = require('ethers').utils
// const TRUFFLE_BUILD_PATH = path.resolve('../../../amp-dex/build/contracts');
// // process.argv[2] ||

// console.log(TRUFFLE_BUILD_PATH);
// let contracts = { '8888': {}, '1000': {} };
// let files = fs.readdirSync(TRUFFLE_BUILD_PATH);

// files.forEach((file, index) => {
//   let address;
//   let symbol;
//   let json = JSON.parse(fs.readFileSync(`${TRUFFLE_BUILD_PATH}/${file}`, 'utf8'));

//   if (json.networks['8888']) {
//     if (file !== 'Owned.json' && file !== 'Migrations.json' && file !== 'SafeMath.json') {
//       symbol = file.slice(0, -5);
//       if (symbol === 'WETH9') symbol = 'WETH';

//       address = json.networks['8888'].address;
//       contracts['8888'][symbol] = utils.getAddress(address);
//     }
//   }

//   if (json.networks['1000']) {
//     if (file !== 'Owned.json' && file !== 'Migrations.json' && file !== 'SafeMath.json') {
//       symbol = file.slice(0, -5);
//       if (symbol === 'WETH9') symbol = 'WETH';
//       address = json.networks['1000'].address;
//       contracts['1000'][symbol] = utils.getAddress(address);
//     }
//   }
// });

// fs.writeFileSync('../config/addresses.json', JSON.stringify(contracts), 'utf8');

const { BACKEND_URL } = require('../config/url')
const http = require('http')

const queryJSON = url =>
  new Promise((resolve, reject) => {
    http
      .get(url, resp => {
        let data = ''

        // A chunk of data has been recieved.
        resp.on('data', chunk => {
          data += chunk
        })

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
          resolve(JSON.parse(data))
        })
      })
      .on('error', err => {
        reject('Error: ' + err.message)
      })
  })

queryJSON(`http://${BACKEND_URL}/tokens`).then(data => {
  // default is exchange contract
  const addressesRet = {
    Exchange: '0x44e5a8cc74C389e805DAa84993bacC2b833E13f0'
  }
  const imagesRet = {}
  data.forEach(row => {
    addressesRet[row.symbol] = row.contractAddress
    imagesRet[row.symbol] = row.image
  })
  const tokenFile = path.join(__dirname, '../config/addresses.json')
  const tokenImageFile = path.join(__dirname, '../config/images.json')
  const addresses = {
    '8888': addressesRet
  }
  const images = {
    '8888': imagesRet
  }
  fs.writeFileSync(tokenFile, JSON.stringify(addresses, null, 2))
  fs.writeFileSync(tokenImageFile, JSON.stringify(images, null, 2))
})
