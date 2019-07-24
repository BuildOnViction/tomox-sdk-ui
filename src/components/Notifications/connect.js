//@flow
import { connect } from 'react-redux'
import notificationsSelector, { 
  getNotifications, 
  resetNotifications,
  resetNewNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  markNotificationUnRead,
} from '../../store/models/notifications'

export function mapStateToProps(state: State, props: Object): LayoutProps {
  const selector = notificationsSelector(state)

  return {
    ...selector,
  }
}

const mapDispatchToProps = {
  getNotifications,
  resetNotifications,
  resetNewNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  markNotificationUnRead,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
