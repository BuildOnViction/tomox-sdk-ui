import React from 'react'
import MetaMaskRenderer from './MetaMaskRenderer'

type State = {
    error: Object,
}

class MetaMask extends React.PureComponent {
    state:State = { error: null }

    unlockWalletWithMetaMask = async _ => {
        const error = await this.props.loginWithMetamask()
        if (error) {this.setState({error})}
    }

    render() {
        return (
            <MetaMaskRenderer
                unlockWallet={this.unlockWalletWithMetaMask}
                error={this.state.error} />
            )
    }
}

export default MetaMask