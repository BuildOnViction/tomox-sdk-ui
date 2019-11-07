import { utils } from 'ethers'
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
  let msg = {
    id: '0x5b8ba1e94971a5143fe0908e',
    amount: utils.bigNumberify('10000000000000000000'),
    baseToken: '0x4bcb5bf25befb3e1250f0cee1b1892230f84a3f3',
    filledAmount: utils.bigNumberify('1000000000000000000'),
    timestamp: 1542000614,
    exchangeAddress: '0xd68c26b99a40227c4abe51020edfd9bba438b297',
    makeFee: utils.bigNumberify('0'),
    nonce: utils.bigNumberify('9581389967892164'),
    pairName: 'AE/WETH',
    pricepoint: utils.bigNumberify('10000000'),
    quoteToken: '0xd645c13c35141d61f273edc0f546bef48a48001d',
    side: 'BUY',
    status: 'OPEN',
    takeFee: utils.bigNumberify('0'),
    userAddress: '0x28074f8D0fd78629cd59290cac185611a8d60109',
  }

  msg = await signer.signOrder(msg)
  console.log(msg.hash, utils.joinSignature(msg.signature))
  expect(msg).toEqual({
    ...msg,
    hash: '0x9391daa047348fef78da66f1f327f8de58700907d51385d810e54d9bac85edf8',
    signature: {
      r: '0x6e01147b0f25f533d7e86e82bfac9ace6c169cb46b6bad5112cefc8bcfd4bd06',
      s: '0x67ad7ed6cec728888d59bf46768b4b99f4941b3e7d150cac126b64ac4565de72',
      v: 28,
    },
  })
})
