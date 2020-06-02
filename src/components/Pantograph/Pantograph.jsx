import React from 'react'
import PantographRenderer from './PantographRenderer'

type State = {
    error: Object,
}

class Pantograph extends React.PureComponent {
    state:State = { error: null }

    unlockWalletWithPantograph = async _ => {
        const error = await this.props.loginWithPantograph()
        if (error) {this.setState({error})}        
    }

    render() {
        return (
            <PantographRenderer
                unlockWallet={this.unlockWalletWithPantograph}
                error={this.state.error} />
            )
    }
}

export default Pantograph