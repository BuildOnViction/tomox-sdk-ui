import React from 'react';

import { Loading } from '../Common';

type Props = {
  authenticated: boolean,
  isOpened: boolean,
  openConnection: void => void
};

class socketController extends React.Component<Props> {
  openConnection() {
    const { openConnection } = this.props;
    //in case the connection is already set, nothing changes
    //otherwise we open the connection. openConnection() returns
    //the unsubscribe method to close the connection
    if (typeof this.unsubscribe !== 'function') {
      this.unsubscribe = openConnection();
    }
  }

  closeConnection() {
    if (typeof this.unsubscribe !== 'function') return;

    this.unsubscribe();
    this.unsubscribe = null;
  }

  componentWillMount() {
    if (this.props.authenticated) this.openConnection();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.authenticated === this.props.authenticated) return;

    this.props.authenticated ? this.openConnection() : this.closeConnection();
  }

  componentWillUnmount() {
    this.closeConnection();
  }

  render() {
    // make sure after open connection successful then render children
    const { isOpened, children } = this.props;
    // check for the first time to avoid initial problems
    if (!isOpened) {
      return <Loading />;
    }
    return children;
  }
}

export default socketController;
