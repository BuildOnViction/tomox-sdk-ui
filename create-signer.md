## Use private key
We use ethers.js library to create Wallet, Signer and sign orders.
https://docs.ethers.io/ethers.js/html/index.html

### 1. Create signer
#### Create <code>wallet</code>
```javascript
import { Wallet } from 'ethers'

const createWallet = async (privatekey) => await Wallet(privatekey)
```
Reference: https://docs.ethers.io/ethers.js/html/api-wallet.html#creating-instances

#### Create <code>provider</code>
```javascript
import { providers } from 'ethers'

const createProvider = (
    networkId?: ?number,
    url?: ?string,
) => (
    new providers.JsonRpcProvider(TOMOCHAIN_NODE_HTTP_URL, {
        chainId: parseInt(DEFAULT_NETWORK_ID, 10),
        name: undefined,
    })
)
```
Reference: https://docs.ethers.io/ethers.js/html/api-providers.html#connecting-to-ethereum


#### Create <code>signer</code>
```javascript
export const createLocalWalletSigner = async (
    networkId: ?number = DEFAULT_NETWORK_ID
) => {
    const provider = createProvider('local')
    const wallet = await createWallet(privatekey)
    const signer = new Wallet(wallet.privateKey, provider)

    addMethodsToSigner(signer)
    window.signer = { instance: signer, type: 'wallet' }

    return wallet.address
}
```
Reference: https://docs.ethers.io/ethers.js/html/api-wallet.html#creating-instances

### 2. Sign and get <code>signature</code>
```javascript
export const createRawOrder = async function (params: any) {
    const signature = await this.signMessage(utils.arrayify(order.hash))
    const { r, s, v } = utils.splitSignature(signature)

    order.signature = { R: r, S: s, V: v }
    return order
}
```

Reference: https://docs.ethers.io/ethers.js/html/api-utils.html?highlight=splitsignature