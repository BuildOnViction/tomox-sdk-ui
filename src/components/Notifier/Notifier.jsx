//@flow
import React from 'react';
import { Position, Toaster } from '@blueprintjs/core';
import { formatNumber } from 'accounting-js';

import type {
  Notification,
  NotificationOptions
} from '../../types/notifications';

// eslint-disable-next-line
type Props = {
  lastNotification: Notification,
  removeNotification: number => void
};

class Notifier extends React.Component<Props> {
  show = ({ notificationType, options }: Notification) => {
    console.log('showing', notificationType, options);

    let notification = NotificationFactory(notificationType, options);
    ToastInstance.show(notification);

    // this.props.removeNotification(this.props.lastNotification.id);
    this.clear(this.props);
  };

  clear(props: Props) {
    let { lastNotification, removeNotification } = props;
    if (lastNotification) removeNotification(lastNotification.id);
  }

  render() {
    let { lastNotification } = this.props;
    // if (lastNotification) lastNotification.id && this.show(lastNotification);
    setImmediate(() => {
      if (lastNotification) lastNotification.id && this.show(lastNotification);
    });

    return null;
  }

  componentDidUpdate(prevProps: Props) {
    this.clear(prevProps);
    // let { lastNotification, removeNotification } = prevProps;
    // if (lastNotification) removeNotification(lastNotification.id);
  }
}

//TODO refactor this
const NotificationFactory = (type, options: NotificationOptions) => {
  switch (type) {
    case 'orderPending':
      return {
        action: {
          href: `https://scan.testnet.tomochain.com/txs/${options.txHash}`,
          target: '_blank',
          text: <strong>View on Etherscan</strong>
        },
        message: (
          <React.Fragment>
            Your order is now pending. You will receive a notification when the
            transaction is confirmed
            <br />
            Pair: {options.pair} <br />
            Side: {options.side} <br />
            Amount: {formatNumber(options.filled, { precision: 3 })}/
            {formatNumber(options.amount, { precision: 3 })}
            <br />
            Price: {formatNumber(options.price, { precision: 3 })}
          </React.Fragment>
        ),
        icon: 'tick',
        intent: 'success',
        timeout: 30000
      };
    case 'orderSuccess':
      return {
        action: {
          href: `https://scan.testnet.tomochain.com/txs/${options.txHash}`,
          target: '_blank',
          text: <strong>View on Etherscan</strong>
        },
        message: (
          <React.Fragment>
            Your order has been successfully executed!
            <br />
            Pair: {options.pair} <br />
            Side: {options.side} <br />
            Amount: {formatNumber(options.filled, { precision: 3 })}/
            {formatNumber(options.amount, { precision: 3 })}
            <br />
            Price: {formatNumber(options.price, { precision: 3 })}
          </React.Fragment>
        ),
        icon: 'tick',
        intent: 'success',
        timeout: 30000
      };
    case 'orderAdded':
      return {
        message: 'Order Added',
        icon: 'tick',
        intent: 'success',
        timeout: 3000
      };
    case 'orderCancelled':
      return {
        message: 'Order Cancelled',
        icon: 'tick',
        intent: 'success'
      };
    case 'orderMatched':
      return {
        message: 'Order Matched',
        icon: 'tick',
        intent: 'success',
        timeout: 3000
      };
    default:
      return {
        message: options.message,
        intent: options.intent
      };
  }
};

const ToastInstance = Toaster.create({
  position: Position.TOP_RIGHT
});

export default Notifier;
