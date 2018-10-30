// @flow
import tokensModel from '../domains/tokens'
import * as actionCreators from '../actions/tokens'
import * as appActionCreators from '../actions/app'
import errors from '../../config/errors'
import type { State, ThunkAction } from '../../types/'

export default function getTokenModel(state: State) {
  return tokensModel(state.tokens)
}

export const sendGetToken = (side: string, amount: number, price: number): ThunkAction => {
  return async (dispatch, { socket }) => {
    try {
      // let state = getState()

      socket.sendGetTokenMessage()
    } catch (e) {
      console.log(e)

      if (e.message === errors.invalidJSON) {
        return dispatch(appActionCreators.addDangerNotification({ message: 'Connection error' }))
      }

      return dispatch(appActionCreators.addDangerNotification({ message: 'Unknown error' }))
    }
  }
}

export const updateTokens = actionCreators.updateTokens
export const updateTokensList = actionCreators.updateTokensList
