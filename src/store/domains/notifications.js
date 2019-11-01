//@flow
const initialState = {
  offset: 1,
  limit: 20,
  loading: false,
  data: [],
  newData: 0,
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

// Notifications from api when use open Notification menu
export const addNotifications = (notifications) => { 
  const event = (state: NotificationState = initialState) => {
    return {
      ...state,
      data: [...state.data, ...notifications],
      offset: ++state.offset,
    }
  }
  return event
}

export const updateNotifications = (notifications) => { 
  const event = (state: NotificationState = initialState) => {
    return {
      ...state,
      data: notifications,
    }
  }
  return event
}

export const resetNotifications = () => {
  const event = _ => ({
    offset: 1,
    limit: 20,
    loading: false,
    data: [],
    newData: 0,
    toaster: null,
  })

  return event
}

export const updateNewNotifications = _ => { 
  const event = (state: NotificationState) => {
    return {
      ...state,
      newData: ++state.newData,
    }
  }

  return event
}

export const resetNewNotifications = _ => { 
  const event = (state: NotificationState) => {
    return {
      ...state,
      newData: 0,
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

