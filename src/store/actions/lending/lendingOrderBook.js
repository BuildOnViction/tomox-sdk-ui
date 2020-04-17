const actionTypes = {
  saveData: 'lendingOrderbook/SAVE_DATA',
  selectOrder: 'lendingOrderbook/SELECT_ORDER',
}

export function saveData(data: any) {
  return {
    type: actionTypes.saveData,
    payload: { data },
  }
}

export function selectOrder(order) {
  return {
    type: actionTypes.selectOrder,
    payload: order,
  }
}

export default actionTypes
