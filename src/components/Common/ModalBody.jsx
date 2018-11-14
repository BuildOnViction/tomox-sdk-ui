import React from 'react';
import { Classes } from '@blueprintjs/core';

const ModalBody = props => {
  return <div className={Classes.DIALOG_BODY}>{props.children}</div>;
};

export default ModalBody;
