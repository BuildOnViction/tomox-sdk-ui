export const sendGetTokenMessage = async () => {
  if (!window.socket) throw new Error('Socket connection not established');

  let message = JSON.stringify({
    channel: 'tokens',
    payload: {
      type: 'GET_TOKENS',
    },
  });

  window.socket.send(message);
};
