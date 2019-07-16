//@flow
const initialState = {
  offset: 0,
  limit: 10,
  data: [],
  newData: [],
}

export const initialized = () => {
  const event = (state: NotificationState = initialState) => state
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

export default function model(state) {
  return {
    getOffset: () => state.offset,
    getLimit: () => state.limit,
    getNotifications: () => state.data,
    getNewNotifications: () => state.newData,
  }
}

// import type {
//   NotificationState,
//   Notification
// } from '../../types/notifications';

// const initialState = [];

// // eslint-disable-next-line
// let id = 0;

// export const initialized = () => {
//   const event = (state: NotificationState = initialState) => state;
//   return event;
// };

// export const notificationAdded = (
//   notificationType: string,
//   options: Object
// ) => {
//   const event = (state: NotificationState) => {
//     return [
//       ...state,
//       {
//         id: ++id,
//         notificationType,
//         options
//       }
//     ];
//   };

//   return event;
// };

// export const notificationRemoved = (
//   id: number
// ): (NotificationState => NotificationState) => {
//   const event = (state: NotificationState) => {
//     return state.filter(notification => notification.id !== id);
//   };

//   return event;
// };

// export default function model(state: NotificationState) {
//   return {
//     byId: (id: number): ?Notification =>
//       state.find(notification => notification.id === id),
//     last: (): ?Notification => state[state.length - 1]
//   };
// }
