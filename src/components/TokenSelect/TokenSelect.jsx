// @flow
import React from 'react'
import TokenSelectRenderer from './TokenSelectRenderer'

class TokenSelect extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.token.address.toLowerCase() !== nextProps.token.address.toLowerCase()
  }
  
  render() {
    return <TokenSelectRenderer items={this.props.tokens} item={this.props.token} onChange={this.props.onChange} />
  }
}

export default TokenSelect
