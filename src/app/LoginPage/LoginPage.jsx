// @flow
import React from 'react'
import { Redirect } from 'react-router-dom'

import LoginPageRenderer from './LoginPageRenderer'

type Props = {
  authenticated: boolean,
}

type State = {
  selectedTabId: string,
}

class LoginPage extends React.PureComponent<Props, State> {

  state = {
    selectedTabId: 'ledger',
    selectedOtherWallet: '',
  }

  handleTabChange = (selectedTabId: string) => {
    this.setState({ selectedTabId, selectedOtherWallet: '' })
  }

  handleOtherWalletChange = (walletType: string) => {
    this.setState({ selectedOtherWallet: walletType })
  }

  render() {

    const {
      props: { authenticated },
      state: { 
        selectedTabId,
        selectedOtherWallet,
      },
      handleTabChange,
      handleOtherWalletChange,
    } = this

    if (authenticated) {
      return <Redirect to="/markets/trading" />
    }

    return (
      <LoginPageRenderer
        selectedTabId={selectedTabId}
        handleTabChange={handleTabChange} 
        selectedOtherWallet={selectedOtherWallet}
        handleOtherWalletChange={handleOtherWalletChange}
      />
    )
  }
}

export default LoginPage
