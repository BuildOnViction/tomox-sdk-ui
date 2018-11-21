const fs = require('fs');
const path = require('path');
var program = require('commander');

require('dotenv').load();

program
  .version('0.1.0')
  .option('-p, --truffle-build-path [value]', 'Truffle build path')
  .parse(process.argv);

// console.log('Truffle build path:', program);

const TRUFFLE_BUILD_PATH = path.resolve(program.truffleBuildPath || '../dex-smart-contract/build/contracts');

const matchedFilesPattern = /(?:WETH|ERC20)\.json$/


let abis = '';
let files = fs.readdirSync(TRUFFLE_BUILD_PATH);

files.filter(file => matchedFilesPattern.test(file)).forEach((file, index) => {
  let json = JSON.parse(fs.readFileSync(`${TRUFFLE_BUILD_PATH}/${file}`, 'utf8'));
  let symbol = file.slice(0, -5);
  abis += `export const ${symbol} = ${JSON.stringify(json.abi, null, 2)};\n\n`
});

console.log(abis);
fs.writeFileSync('src/config/abis.js', abis, 'utf8');