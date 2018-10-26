import React from 'react';

const ImageIcon = ({ size, ...props }) => {
  return <img {...props} width={size} height={size} />;
};

export default ImageIcon;
