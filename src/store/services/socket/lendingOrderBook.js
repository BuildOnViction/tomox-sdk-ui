import { sendMessage } from "./common"

export const subscribeLendingOrderBook = ({ term, lendingToken }) => {
  const message: WebsocketMessage = {
    channel: "lending_orderbook",
    event: {
      type: "SUBSCRIBE",
      payload: {
        term,
        lendingToken,
      },
    },
  }

  return sendMessage(message)
}

export const unsubscribeLendingOrderBook = () => {
  const message: WebsocketMessage = {
    channel: "lending_orderbook",
    event: { type: "UNSUBSCRIBE" },
  }

  return sendMessage(message)
}
