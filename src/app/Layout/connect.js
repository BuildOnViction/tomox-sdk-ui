//@flow
import { connect } from 'react-redux'
import layoutSelector, {
  createProvider,
  changeLocale,
  changeMode,
  queryAppData,
  queryAccountData,
  releaseResource,
} from '../../store/models/layout'
import type { State } from '../../types'
import type { Props as LayoutProps } from './Layout'
import { copyDataSuccess } from '../../store/models/app'
import { markNotificationRead } from '../../store/actions/notifications'

export function mapStateToProps(state: State, props: Object): LayoutProps {
  const selector = layoutSelector(state)

  return {
    ...selector,
  }
}

const mapDispatchToProps = {
  createProvider,
  changeLocale,
  changeMode,
  queryAppData,
  queryAccountData,
  copyDataSuccess,
  releaseResource,
  markNotificationRead,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
