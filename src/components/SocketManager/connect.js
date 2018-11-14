import { connect } from 'react-redux'
import socketManagerSelector, { openConnection } from '../../store/models/socketManager'
// this model using sendGetToken action to get updated tokens
import { sendGetToken } from '../../store/models/tokens'

export function mapStateToProps(state) {
  const { authenticated } = socketManagerSelector(state)

  return { authenticated }
}

const mapDispatchToProps = { openConnection, sendGetToken }

export default connect(
  mapStateToProps,
  mapDispatchToProps
)
