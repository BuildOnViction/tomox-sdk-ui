import React from 'react'
import { Spinner } from '@blueprintjs/core'
import styled from 'styled-components'

const Loading = ({ height }) => (
  <Overlay>
    <Spinner intent="primary" />
  </Overlay>
)

const Overlay = styled.div.attrs({
  className: 'loading-overlay',
})`
  background: ${props => props.theme.mainBg};
`

export default Loading
