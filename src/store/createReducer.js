import { persistReducer } from 'redux-persist'

export default function createReducer(actionHandler: *) {
  return (state: *, action: *) => actionHandler(action)(state)
}

export function createReducerPersist(persistConfig, actionHandler: *) {
  return persistReducer(persistConfig, createReducer(actionHandler))
}