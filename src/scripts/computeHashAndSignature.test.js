import { createLocalWalletSigner } from '../store/services/signer'
createLocalWalletSigner(
  {
    privateKey:
      '0x3411b45169aa5a8312e51357db68621031020dcf46011d7431db1bbb6d3922ce',
  },
  8888
)

const signer = window.signer.instance

it('sign order properly', async () => {
  let order = {
    amount: 0.1,
    exchangeAddress: "0x0D3ab14BBaD3D99F4203bd7a11aCB94882050E7e",
    orderNonce: 4,
    pair: {
      active: true,
      baseTokenAddress: "0x4d7ea2ce949216d6b120f3aa10164173615a2b6c",
      baseTokenDecimals: 18,
      baseTokenSymbol: "BTC",
      pair: "BTC/TOMO",
      quoteTokenAddress: "0x0000000000000000000000000000000000000001",
      quoteTokenDecimals: 18,
      quoteTokenSymbol: "TOMO",
      rank: 0,
    },
    price: 27327.33,
    side: "BUY",
    status: "NEW",
    type: "LO",
    userAddress: "0x17F2beD710ba50Ed27aEa52fc4bD7Bda5ED4a037",
  }

  const expected = {
    amount: "100000000000000000",
    baseToken: "0x4d7ea2ce949216d6b120f3aa10164173615a2b6c",
    baseTokenSymbol: "BTC",
    exchangeAddress: "0x0D3ab14BBaD3D99F4203bd7a11aCB94882050E7e",
    hash: "0xd3b3373e406cf284926cf85eca6a78e7377661be1dc988e1f56ba1b528717122",
    nonce: "4",
    pricepoint: "27327330000000000000000",
    quoteToken: "0x0000000000000000000000000000000000000001",
    quoteTokenSymbol: "TOMO",
    side: "BUY",
    signature: {
      R: "0xb50ce7b8094a6484f65e56446aac2ab74b31589d4f373afab3ae5099b85c4b76",
      S: "0x47da7e0ac3fbae4aea576ff8d6b61ddd647355e1c24dffada0e0d65f1751b458", 
      V: 27,
    },
    status: "NEW",
    type: "LO",
    userAddress: "0x17F2beD710ba50Ed27aEa52fc4bD7Bda5ED4a037",
    userAmount: 0.1,
    userPrice: 27327.33,
  }

  order = await signer.createRawOrder(order)
  expect(order).toEqual(expected)
})
