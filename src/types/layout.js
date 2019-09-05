export type UpdateReferenceCurrencyAction = {
  type: 'walletPage/UPDATE_REFERENCE_CURRENCY',
  payload: { referenceCurrency: string },
};

export type ShowSessionPasswordModal = {
  type: 'layout/SHOW_SESSION_PASSWORD_MODAL',
  payload: { showSessionPasswordModal: Boolean },
};

export type LayoutAction =
 | UpdateReferenceCurrencyAction
 | ShowSessionPasswordModal