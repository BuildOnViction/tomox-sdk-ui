//@flow

export type NotificationOptions = {
  filled: number,
  pair: string,
  side: string,
  txHash: string,
  amount: number,
  price: number,
  message: string,
  intent: string
};

export type Notification = {
  id: number,
  notificationType: string,
  options: NotificationOptions
};

export type NotificationState = Array<Notification>;
