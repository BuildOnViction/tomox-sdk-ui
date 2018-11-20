import React from 'react';
import Colors from './Colors';
import ImageIcon from './ImageIcon';
import ColoredCryptoIcon from './ColoredCryptoIcon';

const TokenIcon = ({ image, symbol, size = 30 }) => {
  if (image && image.url) {
    return <ImageIcon alt={image.meta} src={image.url} size={size} />;
  }

  return <ColoredCryptoIcon size={size} color={Colors.BLUE5} name={symbol} />;
};

export default TokenIcon;
