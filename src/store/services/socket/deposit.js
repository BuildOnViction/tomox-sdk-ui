export const sendNewDepositMessage = async (
  chain,
  associatedAddress,
  pairAddresses
) => {
  if (!window.socket) throw new Error('Socket connection not established');

  let message = JSON.stringify({
    channel: 'deposit',
    event: {
      type: 'NEW_DEPOSIT',
      payload: {
        chain,
        associatedAddress,
        pairAddresses
      }
    }
  });

  window.socket.send(message);
};
