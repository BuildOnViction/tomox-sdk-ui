import { connect } from 'react-redux'
import {
  updateTimeSpan,
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
  const currentPairData = getTokenPairsDomain(state).getCurrentPairData()
  const pricePrecision = currentPairData ? currentPairData.pricePrecision : null
  const mode = getSettingsDomain(state).getMode()

  return {
    ohlcv,
    currentPair: { ...currentPair, pricePrecision },
    mode,
  }
}

export const mapDispatchToProps = {
  updateTimeSpan,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
