import { sendMessage } from "./common"

export const subscribeLendingTrades = ({ term, lendingToken }) => {
  const message: WebsocketMessage = {
    channel: "lending_trades",
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

export const unsubscribeLendingTrades = () => {
  const message: WebsocketMessage = {
    channel: "lending_trades",
    event: { type: "UNSUBSCRIBE" },
  }

  return sendMessage(message)
}
