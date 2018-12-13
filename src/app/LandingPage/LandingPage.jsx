import React from 'react'
import { NonIdealState } from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'
class LandingPage extends React.PureComponent {
  render() {
    return (
      <NonIdealState title="WORK IN PROGRESS" visual="wrench">
        <FormattedMessage id="app.landingPage" defaultMessage="Landing Page" />
      </NonIdealState>
    )
  }
}

export default LandingPage
