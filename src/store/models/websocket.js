// @flow
import websocketModel from '../domains/websocket'
import type {
  State,
} from '../../types/'

export default function getWebsocketModel(state: State) {
  return websocketModel(state.websocket)
}