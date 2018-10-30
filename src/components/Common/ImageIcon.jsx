import React from 'react'

const ImageIcon = ({ size, alt, src }) => {
  return <img src={src} alt={alt} width={size} height={size} />
}

export default ImageIcon
