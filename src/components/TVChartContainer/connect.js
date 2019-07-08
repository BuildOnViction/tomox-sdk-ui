import { connect } from 'react-redux'
import {
  updateDuration,
  updateTimeSpan,
  resetOHLCVData,
} from '../../store/models/ohlcv'
import { 
  getTokenPairsDomain,
  getOhlcvDomain,
  getSettingsDomain,
} from '../../store/domains'
import type { State } from '../../types'

export const mapStateToProps = (state: State) => {
  const ohlcvDomain = getOhlcvDomain(state)
  const ohlcv = ohlcvDomain.getState()
  const currentPair = getTokenPairsDomain(state).getCurrentPair()
  const mode = getSettingsDomain(state).getMode()

  return {
    ohlcv,
    currentPair,
    mode,
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
