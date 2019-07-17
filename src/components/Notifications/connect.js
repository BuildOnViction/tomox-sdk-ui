//@flow
import { connect } from 'react-redux'
import notificationsSelector, { getNotifications } from '../../store/models/notifications'

export function mapStateToProps(state: State, props: Object): LayoutProps {
  const selector = notificationsSelector(state)

  return {
    ...selector,
  }
}

const mapDispatchToProps = {
  getNotifications,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
