//@flow
import React from 'react'
import { Position, Toaster } from '@blueprintjs/core'

import type {
  Notification,
  NotificationOptions,
} from '../../types/notifications'

// eslint-disable-next-line
type Props = {
  lastNotification: Notification,
  removeNotification: number => void
};

class Notifier extends React.Component<Props> {
  show = ({ notificationType, options }: Notification) => {
    const notification = NotificationFactory(notificationType, options)
    if (notification) ToastInstance.show(notification)

    this.clear(this.props)
  };

  clear(props: Props) {
    const { lastNotification, removeNotification } = props
    if (lastNotification) removeNotification(lastNotification.id)
  }

  render() {
    const { lastNotification } = this.props
    setImmediate(() => {
      if (lastNotification) this.show(lastNotification)
    })

    return null
  }

  componentDidUpdate(prevProps: Props) {
    this.clear(prevProps)
  }
}

//TODO refactor this
const NotificationFactory = (type, options: NotificationOptions) => {
  switch (type) {
    case 'orderPending':
    case 'orderSuccess':
    case 'orderMatched':
      return null
    case 'orderAdded':
      return {
        message: 'Order Added',
        icon: 'tick',
        intent: 'success',
        timeout: 3000,
      }
    case 'orderCancelled':
      return {
        message: 'Order Cancelled',
        icon: 'tick',
        intent: 'success',
      }    
    case 'copied': 
      return {
        message: 'The data is copied',
        icon: 'tick',
        intent: 'success',
        timeout: 3000,
      }
    default:
      return {
        message: options.message,
        intent: options.intent,
      }
  }
}

const ToastInstance = Toaster.create({
  position: Position.TOP_CENTER,
})

export default Notifier
