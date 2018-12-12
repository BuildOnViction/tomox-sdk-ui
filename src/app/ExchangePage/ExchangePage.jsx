import React from 'react';
import { NonIdealState } from '@blueprintjs/core';
import { FormattedMessage } from 'react-intl';
class ExchangePage extends React.PureComponent {
  render() {
    return (
      <NonIdealState title="WORK IN PROGRESS" visual="wrench">
        <FormattedMessage id="app.landingPage" />
      </NonIdealState>
    );
  }
}

export default ExchangePage;
