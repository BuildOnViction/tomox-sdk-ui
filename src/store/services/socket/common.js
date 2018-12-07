//@flow

type Callback = (?Object) => void;

export const isClosed = () => {
  if (!window.socket) return true;
  return window.socket.readyState === window.socket.CLOSED;
};

export const isClosing = () => {
  if (!window.socket) return false;
  return window.socket.readyState === window.socket.CLOSING;
};

export const isConnecting = () => {
  if (!window.socket) return false;
  return window.socket.readyState === window.socket.CONNECTING;
};

export const isOpen = () => {
  if (!window.socket) return false;
  return window.socket.readyState === window.socket.OPEN;
};

export const waitForConnection = (
  callback: Callback,
  timeout: number,
  tick: number,
  interval: number
) => {
  if (!window.socket)
    return callback(new Error('Socket connection not established'));
  if (tick > interval)
    return callback(new Error('Waiting for socket is timeout'));
  if (isOpen()) {
    callback();
  } else {
    // optional: implement backoff for interval here
    setTimeout(() => {
      waitForConnection(callback, timeout, tick + interval, interval);
    }, interval);
  }
};

export const sendMessage = async (message: any, timeout: number = 10000) => {
  return new Promise((resolve, reject) => {
    waitForConnection(
      err => {
        if (err) {
          reject(err);
        } else {
          try {
            window.socket.send(JSON.stringify(message));
            resolve(true);
          } catch (jsonErr) {
            reject(jsonErr);
          }
        }
      },
      timeout,
      0,
      1000
    );
  });
};
