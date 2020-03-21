// @flow
import type { Node } from 'react'
import React from 'react'
import styled from 'styled-components'
import { Dialog } from '@blueprintjs/core'
import { TmColors, Theme } from '../Common'

type Props = {
  title: string,
  icon: string,
  isOpen: boolean,
  onClose: (SyntheticInputEvent<>) => void,
  children: Node
}

// disable enforceFocus so that we can type something on modal over modals
const Modal = (props: Props): Node => {
  return (
    <StyledDialog
      title={props.title}
      isOpen={props.isOpen}
      enforceFocus={false}
      usePortal={false}
      onClose={props.onClose}
      className={props.size}
      canOutsideClickClose={false}
    >
      <DialogContent>{props.children}</DialogContent>
    </StyledDialog>
  )
}

const StyledDialog = styled(Dialog)`
  color: ${props => props.theme.modalColor};

  &,
  .bp3-dialog-header {
    background-color: ${props => props.theme.modalBackground} !important;
  }

  button.bp3-dialog-close-button,
  button.bp3-dialog-close-button:hover {
    background: none;
  }

  button.bp3-dialog-close-button:hover .bp3-icon.bp3-icon-small-cross {
    color: ${TmColors.RED};
  }

  .bp3-heading,
  .bp3-input {
    color: ${props => props.theme.modalColor};
  }

  .bp3-heading {
    font-size: ${Theme.FONT_SIZE_H4};
    font-weight: 300;
  }
`

const DialogContent = styled.div.attrs({
  className: "tm-dialog-body",
})`
  margin: 0;
`

export default Modal
