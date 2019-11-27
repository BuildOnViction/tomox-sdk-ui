import accountBalancesDomain from './accountBalances'
import * as eventCreators from './accountBalances'

function getDomain(events) {
  const state = events.reduce((state, event) => event(state), undefined)

  return accountBalancesDomain(state)
}

//TODO: need to run Commented tests after solving Account Balances Issue @line 56 and 36
it('handles initialized event properly', () => {
  const domain = getDomain([eventCreators.initialized()])

  expect(domain.get()).toEqual(null)
  expect(domain.isSubscribed()).toEqual(false)
})

it('handles subscribed event properly', () => {
  const domain = getDomain([eventCreators.initialized(), eventCreators.subscribed('REQ')])

  expect(domain.get('REQ')).toEqual(null)
  expect(domain.isSubscribed('REQ')).toEqual(true)
})

it('handles updated event properly', () => {
  const data = {
    "0x0000000000000000000000000000000000000001": {
      address: "0x0000000000000000000000000000000000000001",
      availableBalance: "999999985256884602581200000000",
      balance: "999999985256884602581200000000",
      decimals: 18,
      inOrderBalance: "0",
      symbol: "TOMO",
    },
    "0x4d7eA2cE949216D6b120f3AA10164173615A2b6C": {
      address: "0x4d7eA2cE949216D6b120f3AA10164173615A2b6C",
      availableBalance: "999981000000350000000000000000",
      balance: "999981000000350000000000000000",
      decimals: 18,
      inOrderBalance: "0",
      symbol: "BTC",
    },
  }

  const expedted =  [
    {"balance": "999,999,985,256.8846026", "symbol": "TOMO"}, 
    {"balance": "999,981,000,000.3500000", "symbol": "BTC"}]

  const domain = getDomain([
    eventCreators.initialized(),
    eventCreators.updated(data),
  ])

  expect(domain.get('TOMO')).toEqual('999999985256.8846026')
  expect(domain.get('BTC')).toEqual('999981000000.3500000')
  expect(domain.balancesArray()).toEqual(expedted)
})
