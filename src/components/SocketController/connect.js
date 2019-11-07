import {
  connect,
} from 'react-redux'
import socketControllerSelector, {
  openConnection,
} from '../../store/models/socketController'

export function mapStateToProps(state) {
  const {
    authenticated,
    isOpened,
  } = socketControllerSelector(state)

  return {
    authenticated,
    isOpened,
  }
}

const mapDispatchToProps = {
  openConnection,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)