import { utils } from 'ethers'
import { createLocalWalletSigner } from '../store/services/signer'
createLocalWalletSigner({ privateKey: '0x3411b45169aa5a8312e51357db68621031020dcf46011d7431db1bbb6d3922ce' }, 8888)

let signer = window.signer.instance

it('sign order properly', async () => {
  let msg = {
    amount: utils.bigNumberify('10000000000000000000'),
    baseToken: '0x4bcb5bf25befb3e1250f0cee1b1892230f84a3f3',
    buyAmount: '10000000000000000000',
    buyToken: '0x4bcb5bf25befb3e1250f0cee1b1892230f84a3f3',
    timestamp: 1541992942502,
    exchangeAddress: '0xd68c26b99a40227c4abe51020edfd9bba438b297',
    expires: '10000000000000',
    filledAmount: '0',
    makeFee: '0',
    nonce: '9581389967892164',
    pairName: 'AE/WETH',
    pricepoint: '10000000',
    quoteToken: '0xd645c13c35141d61f273edc0f546bef48a48001d',
    sellAmount: '100000000000000000000',
    sellToken: '0xd645c13c35141d61f273edc0f546bef48a48001d',
    side: 'BUY',
    status: 'OPEN',
    takeFee: '0',
    userAddress: '0x28074f8d0fd78629cd59290cac185611a8d60109'
  }

  msg = await signer.signOrder(msg)
  console.log(
    utils.bigNumberify('10000000000000000000'),
    utils.joinSignature({ r: msg.signature.R, s: msg.signature.S, recoveryParam: msg.signature.V - 27 })
  )
  expect(msg).toEqual({
    ...msg,
    hash: '0xd0fbab67df5408e8e09ac22833d6d56c6736df4ce5514bb0529f3fadee219053',
    signature: {
      R: '0xf7581e4b94c68c5f761c07145104d701aaa08580fb247efb2b212f8dfc73af4c',
      S: '0x56567688e52ac6e368f1828b467fff1d3a39249998220f39fd3f7aed4dd39767',
      V: 27
    }
  })
})
