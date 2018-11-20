// @flow
import type { Node } from 'react';
import React from 'react';
import { Dialog } from '@blueprintjs/core';

type Props = {
  title: string,
  icon: string,
  isOpen: boolean,
  onClose: (SyntheticInputEvent<>) => void,
  children: Node
};

// disable enforceFocus so that we can type something on modal over modals
const Modal = (props: Props): Node => {
  return (
    <Dialog
      title={props.title}
      icon={props.icon}
      isOpen={props.isOpen}
      enforceFocus={false}
      usePortal={false}
      onClose={props.onClose}
      style={{ width: '800px' }}
      className="bp3-dark"
      canOutsideClickClose={false}
    >
      <div className="bp3-dialog-body">{props.children}</div>
    </Dialog>
  );
};

export default Modal;
