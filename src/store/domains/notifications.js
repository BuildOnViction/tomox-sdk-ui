//@flow
const initialState = {
  offset: 0,
  limit: 10,
  loading: false,
  data: [],
  newData: [],
  toaster: null,
}

export const initialized = () => {
  const event = (state: NotificationState = initialState) => state
  return event
}

export const updateNotificationsLoading = (loading: Boolean) => { 
  const event = (state: NotificationState = initialState) => {
    return {
      ...state,
      loading,
    }
  }
  return event
}

export const updateNotifications = (notifications) => { 
  const event = (state: NotificationState = initialState) => {
    return {
      ...state,
      data: [...state.data, ...notifications.reverse()],
      offset: ++state.offset,
    }
  }
  return event
}

export const updateToaster = (notification: Object) => { 
  const event = (state: NotificationState = initialState) => {
    return {
      ...state,
      toaster: notification,
    }
  }
  return event
}

export const removeToaster = () => { 
  const event = (state: NotificationState = initialState) => {
    return {
      ...state,
      toaster: null,
    }
  }
  return event
}

export default function model(state) {
  return {
    getOffset: () => state.offset,
    getLimit: () => state.limit,
    getNotifications: () => state.data,
    getLoading: () => state.loading,
    getNewNotifications: () => state.newData,
    getToaster: () => state.toaster,
  }
}

