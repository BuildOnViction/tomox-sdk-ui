//@flow
import React from 'react'
import styled from 'styled-components'
import { Box } from './Box'
import tomoXLogo from '../../assets/tomoLogo.png'

const TomoXLogo = (props: { height: number, width: number, alt: string }) => {
  const { height, width, alt } = props

  return (
    <Wrapper>
      <Box p={3}>
        <img src={tomoXLogo} className="Profile-image" width={width} height={height} alt={alt} />
      </Box>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  opacity: 0.3;
`

export default TomoXLogo
