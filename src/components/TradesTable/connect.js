// @flow
import { connect } from 'react-redux'
import tradesTableSelector from '../../store/models/tradesTable'
import type { State } from '../../types'

export const mapStateToProps = (state: State) => {
  const selector = tradesTableSelector(state)
  return {
    trades: selector.trades(50),
    // userTrades: selector.userTrades(),
    currentPair: selector.currentPair(),
  }
}

export default connect(
  mapStateToProps,
  null
)
