//@flow
import React from 'react'
import tomoXLogo from '../../assets/logo.png'

const TomoXLogo = (props: { height: number, width: number, alt: string }) => {
  const { height, width, alt } = props

  return (
    <img src={tomoXLogo} className="Profile-image" width={width} height={height} alt={alt} />
  )
}

export default TomoXLogo
