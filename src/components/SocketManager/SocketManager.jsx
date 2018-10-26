import React from 'react'

type Props = {
  authenticated: boolean,
  openConnection: void => void
}

// create socket context so that other socket will listen to value change of socket status
// export const SocketContext = React.createContext('socket');

class SocketManager extends React.PureComponent {
  constructor(props) {
    super(props)
    // this.state = {
    //   wsStatus: 'iddle',
    // };
    this.onConnectWS = this.onConnectWS.bind(this)
  }

  onConnectWS(status) {
    // console.log('event', status);
    // this.setState({ wsStatus: status });
    if (status === 'open') {
      console.log('Need update token list')
      // this.props.sendGetToken()
    }
  }

  openConnection() {
    //in case the connection is already set, nothing changes
    //otherwise we open the connection. openConnection() returns
    //the unsubscribe method to close the connection

    if (typeof this.unsubscribe !== 'function') {
      this.unsubscribe = this.props.openConnection(this.onConnectWS)
    }
  }

  closeConnection() {
    if (typeof this.unsubscribe !== 'function') return

    this.unsubscribe()
    this.unsubscribe = null
  }

  componentDidMount() {
    if (this.props.authenticated) this.openConnection()

    // init data here
  }

  componentDidUpdate(prevProps) {
    if (prevProps.authenticated === this.props.authenticated) return

    this.props.authenticated ? this.openConnection() : this.closeConnection()
  }

  componentWillUnmount() {
    this.closeConnection()
  }

  render() {
    const { children } = this.props
    return children
    // const { wsStatus } = this.state;
    // return <SocketContext.Provider value={wsStatus}>{children}</SocketContext.Provider>;
  }
}

export default SocketManager
