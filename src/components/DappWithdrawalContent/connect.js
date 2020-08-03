import { connect } from 'react-redux'

import 
  withdrawPageSelector, 
  { 
    withdrawToken,
    getBridgeTokenConfig, 
    getBridgeWithdrawHistory,
  } 
from '../../store/models/withdrawPage'

export function mapStateToProps(state: State) {
    const selector = withdrawPageSelector(state)
  
    return {
      ...selector,
    }
}

export const mapPropsToDispatch = {
  withdrawToken,
  getBridgeTokenConfig,
  getBridgeWithdrawHistory,
}

export default connect(
    mapStateToProps,
    mapPropsToDispatch,
)