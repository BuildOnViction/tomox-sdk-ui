import * as appActionCreators from '../actions/app'

export function copyDataSuccess() {
    return (dispatch) => {
        dispatch(appActionCreators.copyDataSuccessNotification())
    }
}