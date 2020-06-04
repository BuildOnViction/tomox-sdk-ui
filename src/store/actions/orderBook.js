const actionTypes = {
  saveData: 'orderBook/SAVE_DATA',
  select: 'orderBook/SELECT',
  updateDecimals: 'orderBook/UPDATE_DECIMALS',
}

export function saveData(data: any) {
  return {
    type: actionTypes.saveData,
    payload: { data },
  }
}

export function select(order) {
  return {
    type: actionTypes.select,
    payload: { order },
  }
}

export function updateDecimals(decimals: number) {
  return {
    type: actionTypes.updateDecimals,
    payload: { decimals },
  }
}

export default actionTypes
