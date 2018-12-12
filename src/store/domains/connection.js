//@flow

import type { ConnectionState } from '../../types/connection';

const initialState = {
  connectedCount: 0,
  isConnecting: false
};

export const initialized = () => {
  const event = (state: ConnectionState = initialState) => state;

  return event;
};

export const initiated = () => {
  const event = (state: ConnectionState) => ({
    ...state,
    isConnecting: true
  });

  return event;
};

export const opened = () => {
  const event = (state: ConnectionState) => ({
    ...state,
    connectedCount: state.connectedCount + 1,
    isConnecting: false
  });

  return event;
};

export const closed = () => {
  const event = (state: ConnectionState) => ({
    ...state,
    isConnecting: true
  });

  return event;
};

export default function connectionDomain(state: ConnectionState) {
  return {
    isConnected: !state.isConnecting && state.connectedCount > 0,
    isConnecting: state.isConnecting,
    isInitiated: state.connectedCount > 0
  };
}
