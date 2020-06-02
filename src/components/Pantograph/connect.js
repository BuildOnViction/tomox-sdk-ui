import { connect } from 'react-redux'
import { loginWithPantograph } from '../../store/models/loginPage'

const mapDispatchToProps = {
    loginWithPantograph,
}

export default connect(
    null,
    mapDispatchToProps,
)
