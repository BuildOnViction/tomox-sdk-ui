import React from 'react';
import { Position, Toaster } from '@blueprintjs/core';

// eslint-disable-next-line
type Props = {
  lastNotification: Object,
  removeNotification: number => void,
};

class Notifier extends React.Component {
  show(notification) {
    let { intent, message } = notification;
    Notification.show({ intent: intent || 'success', message: message });
    this.clear(this.props);
  }

  clear(props) {
    let { lastNotification, removeNotification } = props;
    if (lastNotification) removeNotification(lastNotification.id);
  }

  render() {
    let { lastNotification } = this.props;
    setImmediate(() => {
      if (lastNotification) lastNotification.id && this.show(lastNotification);
    });
    return null;
  }

  componentDidUpdate(prevProps) {
    this.clear(prevProps);
  }
}

const Notification = Toaster.create({
  position: Position.TOP_RIGHT,
});

export default Notifier;
