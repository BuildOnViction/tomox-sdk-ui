import React from 'react'
import { shallow } from 'enzyme'
import TokenSearcher from './TokenSearcher'
import { Provider } from 'react-redux'
import createStore from '../../store/configureStore'

const updateFavorite = jest.fn()

describe('renders', () => {
  it('renders without crashing', () => {
    const { store } = createStore()
    shallow(
      <Provider store={store}>
        <TokenSearcher updateFavorite={updateFavorite} />
      </Provider>
    )
  })
})
