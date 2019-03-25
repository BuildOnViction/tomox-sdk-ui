import { connect } from 'react-redux'
import ohlcvModel, {
  updateDuration,
  updateTimeSpan,
  resetOHLCVData,
} from '../../store/models/ohlcv'
import { getTokenPairsDomain } from '../../store/domains'
import type { State } from '../../types'

export const mapStateToProps = (state: State) => {
  const ohlcv = ohlcvModel(state).getState()
  const currentPair = getTokenPairsDomain(state).getCurrentPair()
  return {
    ohlcv,
    currentPair,
  }
}

export const mapDispatchToProps = {
  updateDuration,
  updateTimeSpan,
  resetOHLCVData,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
