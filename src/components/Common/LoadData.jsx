// @flow

import React from 'react'

import type { Element } from 'react'

type Data = any[];

type Props = {
  /** a promise that return an array */
  getData: () => Data,
  /** a function that render an array into React Element */
  children: Data => Element<any>,
};

type State = {
  data: Data,
};

export default class LoadData extends React.Component<Props, State> {
  state = {
    data: [],
  };
  async componentDidMount() {
    const data = await this.props.getData()
    this.setState({ data })
  }
  render() {
    return this.props.children(this.state.data)
  }
}
