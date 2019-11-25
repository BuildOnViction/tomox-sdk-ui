//@flow
import React from 'react'
import tomoXLogo from '../../assets/logo.png'

class TomoXLogo extends React.PureComponent {

  state = {
    src: this.props.src || tomoXLogo + 'not-found',
    width: 40,
    height: 40,
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.src === this.props.src 
      && prevProps.width === this.props.width
      && prevProps.height === this.props.height) return

    this.setState({
      src: this.props.src,
      width: this.props.width,
      height: this.props.height,
    })
  }

  onError = () => {
    this.setState({
      src: tomoXLogo,
    })
  }

  render() {
    const { src, height, width } = this.state

    return (
      <img 
        src={src} 
        className="Profile-image" 
        width={width} 
        height={height} 
        alt='logo'
        onError={this.onError} />
    )
  }
}

export default TomoXLogo
