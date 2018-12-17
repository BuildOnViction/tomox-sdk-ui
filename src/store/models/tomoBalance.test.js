import createStore from '../configureStore'
import * as ether from '../services/ether'
import getTomoBalanceModel from './tomoBalance'
import * as actionCreators from './tomoBalance'

jest.mock('../services/ether')

const unsubscribe = jest.fn()
let model

beforeEach(() => {
  ether.subscribeBalance.mockReturnValue(unsubscribe)
})

it('handle subscribeBalance properly', () => {
  const address = 'test address'
  const { store } = createStore()

  model = getTomoBalanceModel(store.getState())
  expect(model.get(address)).toEqual(null)
  expect(model.isSubscribed(address)).toEqual(false)

  const returnFunction = store.dispatch(
    actionCreators.subscribeBalance(address)
  )

  model = getTomoBalanceModel(store.getState())
  expect(model.get(address)).toEqual(null)
  expect(model.isSubscribed(address)).toEqual(true)

  expect(ether.subscribeBalance).toHaveBeenCalledTimes(1)
  expect(ether.subscribeBalance.mock.calls[0][0]).toEqual(address)

  const callback = ether.subscribeBalance.mock.calls[0][1]

  callback('test balance 1')
  model = getTomoBalanceModel(store.getState())
  expect(model.get(address)).toEqual('test balance 1')
  expect(model.isSubscribed(address)).toEqual(true)

  callback('test balance 2')
  model = getTomoBalanceModel(store.getState())
  expect(model.get(address)).toEqual('test balance 2')
  expect(model.isSubscribed(address)).toEqual(true)

  returnFunction()
  expect(unsubscribe).toHaveBeenCalledTimes(1)

  model = getTomoBalanceModel(store.getState())
  expect(model.get(address)).toEqual(null)
  expect(model.isSubscribed(address)).toEqual(false)
})
