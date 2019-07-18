//@flow
import { connect } from 'react-redux'
import notificationsSelector, { 
  getNotifications, 
  resetNewNotifications,
} from '../../store/models/notifications'

export function mapStateToProps(state: State, props: Object): LayoutProps {
  const selector = notificationsSelector(state)

  return {
    ...selector,
  }
}

const mapDispatchToProps = {
  getNotifications,
  resetNewNotifications,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
