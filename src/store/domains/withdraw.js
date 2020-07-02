// @flow
const initialState = {
  data: [],
  total: 0,
}

export const initialized = () => {
  const event = (state = initialState) => state
  return event
}

export const updateRecentHistory = (data: Array<Object>, total: number) => {
  const event = (state) => ({
    ...state,
    data,
    total,
  })

  return event
}

export default function withdrawDomain(state) {
  return {
    getData: () => state.data,
    getTotal: () => state.total,
  }
}
