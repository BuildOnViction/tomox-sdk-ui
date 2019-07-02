// @flow
import type { Node } from 'react'
import React from 'react'
import styled from 'styled-components'
import { Dialog } from '@blueprintjs/core'

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
    <Dialog
      title={props.title}
      isOpen={props.isOpen}
      enforceFocus={false}
      usePortal={false}
      onClose={props.onClose}
      // style={{ width: '800px' }}
      className={props.className}
      canOutsideClickClose={false}
    >
      <BodyDialog>{props.children}</BodyDialog>
    </Dialog>
  )
}

export default Modal

const BodyDialog = styled.div.attrs({
  className: 'bp3-dialog-body',
})`
  margin: 0;
`
