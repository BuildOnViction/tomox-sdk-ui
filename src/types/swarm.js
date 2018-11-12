//@flow
export type Feed = {
  +topic: string,
  +user: string
}

export type Epoch = {
  +time: number,
  +level: number
}

export type Request = {
  feed: Feed,
  epoch: Epoch,
  protocolVersion: number
}
