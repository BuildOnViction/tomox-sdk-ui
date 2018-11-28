## I. Prerequisites
1. Install Geth: 
```
https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Ubuntu#installing-from-ppa
```

2. Install Swarm: 
```
https://swarm-guide.readthedocs.io/en/latest/installation.html#installing-swarm-on-ubuntu-via-ppa
```

## II. dex-protocol
1. Clone it: 
```
git clone git@github.com:tomochain/dex-protocol.git
```
2. Install necessary golang packages:
```
yarn install-requirements
```
3. 
```
    cd OrderBook
    mkdir $GOPATH/src/github.com/tomochain
    ln -sF $PWD $GOPATH/src/github.com/tomochain/orderbook
```
4. Reset go-ethereum repository to a specific commit in order to work (temporary):
```
    cd $GOPATH/src/github.com/ethereum/go-ethereum
    git reset --hard 126dfde6
```
5. By default, we use POA consensus for demo  
    Assume you are in `dex-protocol` folder:
``` 
    Run Node1: `yarn node1 -mining true`  
    Run Node2: `yarn node2 -mining true`  
    Run Backend: `yarn backend` (optional)
```

## III. dex-smart-contract
1. Clone it: 
```
git clone git@github.com:tomochain/dex-smart-contract.git
```
2. Install truffle:
```
yarn global add truffle
```
3. Run `yarn`
4. Deploy contracts to blockchain:
```
yarn deploy-contracts
```

## IV. dex-client
1. Clone it:
```
git clone git@github.com:tomochain/dex-client.git
```
2. Run `yarn`
3. Install `sass`:
```
https://sass-lang.com/install
```
4. Compile sass:
```
yarn sass
```
5. Copy token addresses into file `src/config/addresses.json`:
```
yarn query-tokens
```
6. Run `yarn start`

## V. dex-server
1. Clone it:
```
git clone git@github.com:tomochain/dex-server.git
```
2. `yarn install-requirements`
3. `yarn start-env`
4. `yarn generate-seeds`
5. `yarn seeds`
6. `yarn start`

