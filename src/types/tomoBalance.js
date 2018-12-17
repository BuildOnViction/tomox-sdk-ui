//@flow
export type TomoBalanceState = { +[string]: string }

export type SubscribeBalanceAction = {
  type: 'tomoBalance/SUBSCRIBE_BALANCE',
  payload: { address: string }
}

export type UpdateBalanceAction = {
  type: 'tomoBalance/UPDATE_BALANCE',
  payload: { address: string, balance: string }
}

export type UnsubscribeBalanceAction = {
  type: 'tomoBalance/UNSUBSCRIBE_BALANCE',
  payload: { address: string }
}

export type TomoBalanceEvent = any => TomoBalanceState => TomoBalanceState
export type TomoBalanceAction = SubscribeBalanceAction | UpdateBalanceAction | UnsubscribeBalanceAction
