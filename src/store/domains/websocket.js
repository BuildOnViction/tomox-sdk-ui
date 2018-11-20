// @flow
import type {
  WebsocketState
} from '../../types/websocket'

const initialState: WebsocketState = {
  status: 'close'
}

export const initialized = () => {
  const newState = (state: WebsocketState = initialState) => state
  return newState
}

export const savedWebsocketStatus = (status: string, extra: ? Object) => {
  const newState = (state: WebsocketState) => ({
    ...state,
    status,
    ...extra,
  })
  return newState
}

export default function model(state: WebsocketState) {
  return {
    isOpened: () => state.status === 'open',
  }
}