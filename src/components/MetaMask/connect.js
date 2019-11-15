import { connect } from 'react-redux'
import { loginWithMetamask } from '../../store/models/loginPage'

const mapDispatchToProps = {
    loginWithMetamask,
}

export default connect(
    null,
    mapDispatchToProps,
)
