import { connect } from 'react-redux'

import 
  depositPageSelector, 
  { 
    getBridgeTokenConfig, 
    getBridgeDepositAddress, 
    getBridgeDepositHistory,
    updateCurrentPair,
  } 
from '../../store/models/depositPage'
import { copyDataSuccess } from '../../store/models/app'

export function mapStateToProps(state: State) {
    const selector = depositPageSelector(state)
  
    return {
      ...selector,
    }
}

export const mapPropsToDispatch = {
  getBridgeTokenConfig,
  getBridgeDepositAddress,
  copyDataSuccess,
  getBridgeDepositHistory,
  updateCurrentPair,
}

export default connect(
    mapStateToProps,
    mapPropsToDispatch,
)