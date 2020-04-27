import { connect } from 'react-redux'

import getAccountSelector from '../../store/models/account'

export function mapStateToProps(state: State) {
  const selector = getAccountSelector(state)
  return {
    ...selector,
  }
}

export default connect(mapStateToProps, null)