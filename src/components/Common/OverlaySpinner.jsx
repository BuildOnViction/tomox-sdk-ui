//@flow
import React from 'react'
import styled from 'styled-components'
// import Colors from './Colors'
import { Spinner } from '@blueprintjs/core'

type Props = {
  visible: boolean,
  transparent: boolean,
};

const SpinnerContainer = ({ transparent, visible }: Props) => {
  return (
    <Wrapper visible={visible} transparent={transparent}>
      <Spinner large intent="primary" />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: ${props => (props.visible ? 'flex' : 'none')};
  opacity: ${props => (props.transparent ? 0.95 : 1)};
  background-color: transparent;
  position: absolute;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  top: 0%;
  left: 0%;
  z-index: 100;
`

export default SpinnerContainer
