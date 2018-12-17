import model from './tomoBalance'
import * as eventCreators from './tomoBalance'

function getModel(events) {
  const state = events.reduce((state, event) => event(state), undefined)

  return model(state)
}

it('handles initialized event properly', () => {
  const tomoBalance = getModel([eventCreators.initialized()])

  expect(tomoBalance.get('test address')).toEqual(null)
  expect(tomoBalance.isSubscribed('test address')).toEqual(false)
})

it('handles subscribed event properly', () => {
  const tomoBalance = getModel([eventCreators.initialized(), eventCreators.subscribed('test address')])

  expect(tomoBalance.get('test address')).toEqual(null)
  expect(tomoBalance.isSubscribed('test address')).toEqual(true)
})

it('handles updated event properly', () => {
  const tomoBalance = getModel([
    eventCreators.initialized(),
    eventCreators.subscribed('test address'),
    eventCreators.updated('test address', 'test balance')
  ])

  expect(tomoBalance.get('test address')).toEqual('test balance')
  expect(tomoBalance.isSubscribed('test address')).toEqual(true)
})

it('handles unsubscribed event properly', () => {
  const tomoBalance = getModel([
    eventCreators.initialized(),
    eventCreators.subscribed('test address'),
    eventCreators.updated('test address', 'test balance'),
    eventCreators.unsubscribed('test address')
  ])

  expect(tomoBalance.get('test address')).toEqual(null)
  expect(tomoBalance.isSubscribed('test address')).toEqual(false)
})
