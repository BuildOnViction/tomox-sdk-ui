const actionTypes = {
  addNotification: 'app/ADD_NOTIFICATION',
  addErrorNotification: 'app/ADD_DANGER_NOTIFICATION',
  addSuccessNotification: 'app/ADD_SUCCESS_NOTIFICATION',
  removeNotification: 'app/REMOVE_NOTIFICATION',
  updateCurrentBlock: 'app/UPDATE_CURRENT_BLOCK',
  copyDataSuccessNotification: 'app/COPY_DATA_SUCCESS_NOTIFICATION',
}

export function addNotification(options) {
  return {
    type: actionTypes.addNotification,
    payload: {
      options,
    },
  }
}

export function addOrderAddedNotification() {
  return {
    type: actionTypes.addNotification,
    payload: {
      notificationType: 'orderAdded',
    },
  }
}

export function addOrderCancelledNotification() {
  return {
    type: actionTypes.addNotification,
    payload: {
      notificationType: 'orderCancelled',
    },
  }
}

export function addOrderRejectedNotification() {
  return {
    type: actionTypes.addNotification,
    payload: {
      notificationType: 'orderRejected',
    },
  }
}

export function addOrderMatchedNotification() {
  return {
    type: actionTypes.addNotification,
    payload: {
      notificationType: 'orderMatched',
    },
  }
}

export function addOrderPendingNotification(options) {
  return {
    type: actionTypes.addNotification,
    payload: {
      notificationType: 'orderPending',
      options,
    },
  }
}

export function addOrderSuccessNotification(options) {
  return {
    type: actionTypes.addNotification,
    payload: {
      notificationType: 'orderSuccess',
      options,
    },
  }
}

export function addTxSuccessNotification(options) {
  return {
    type: actionTypes.addNotification,
    payload: {
      notificationType: 'txSuccess',
      options,
    },
  }
}

export function addTxRevertedNotification(options) {
  return {
    type: actionTypes.addNotification,
    payload: {
      notificationType: 'txReverted',
      options,
    },
  }
}

export function addSuccessNotification({ notificationType, message }) {
  return {
    type: actionTypes.addNotification,
    payload: {
      notificationType,
      options: {
        intent: 'success',
        message,
      },
    },
  }
}

export function addErrorNotification({
                                       message,
                                     }) {
  return {
    type: actionTypes.addNotification,
    payload: {
      options: {
        intent: 'danger',
        message,
      },
    },
  }
}

export function removeNotification(id) {
  return {
    type: actionTypes.removeNotification,
    payload: {
      id,
    },
  }
}

export function updateCurrentBlock(currentBlock: string) {
  return {
    type: actionTypes.updateCurrentBlock,
    payload: {
      currentBlock,
    },
  }
}

export function copyDataSuccessNotification() {
  return {
    type: actionTypes.copyDataSuccessNotification,
    payload: {
      notificationType: 'copied',
    },
  }
}

export default actionTypes
