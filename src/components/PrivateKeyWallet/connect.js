import { connect } from 'react-redux'
import { loginWithWallet } from '../../store/models/loginPage'

const mapDispatchToProps = {
    loginWithWallet,
}

export default connect(
    null,
    mapDispatchToProps,
)
