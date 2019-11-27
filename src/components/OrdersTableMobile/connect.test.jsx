import React from 'react'
import { Provider } from 'react-redux'
import createStore from '../../store/configureStore'
import connect from './connect'
import { shallow } from 'enzyme'

describe('connect(Component)', () => {
  it('injects certain props and renders without crashing', () => {
    const { store } = createStore()
    const ConnectedTestComponent = connect(props => {
      expect(props).toBeDefined()
      expect(props).toHaveProperty('orders')
      return null
    })

    shallow(
      <Provider store={store}>
        <ConnectedTestComponent />
      </Provider>
    )
  })
})
