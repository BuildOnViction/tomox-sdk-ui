import { connect } from 'react-redux'
import {
  updateTimeSpan,
} from '../../../store/models/ohlcv'
import { 
  getLendingOhlcvDomain,
  getSettingsDomain,
  getLendingPairsDomain,
} from '../../../store/domains'
import type { State } from '../../../types'

export const mapStateToProps = (state: State) => {
  const ohlcvDomain = getLendingOhlcvDomain(state)
  const ohlcv = ohlcvDomain.getState()
  const loading = ohlcvDomain.getLoading()
  const currentPair = getLendingPairsDomain(state).getCurrentPair()
  const currentPairData = getLendingPairsDomain(state).getCurrentPairData()
  const pricePrecision = currentPairData ? currentPairData.pricePrecision : null
  const settingsDomain = getSettingsDomain(state)
  const mode = settingsDomain.getMode()
  const locale = settingsDomain.getLocale()

  return {
    ohlcv,
    currentPair: { ...currentPair, pricePrecision },
    mode,
    locale,
    loading,
  }
}

export const mapDispatchToProps = {
  updateTimeSpan,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
