import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { TmColors, UtilityIcon } from '../../components/Common'

function Dapp() {
    return (
        <Wrapper>
            <LinkBtn to="/dapp/spot">
                <UtilityIcon color="#fff" name="spot" />
                <Title>Spot</Title>
            </LinkBtn>
            <Divider>Or</Divider>
            <LinkBtn to="/dapp/lending">
                <UtilityIcon color="#fff" name="lending" /> 
                <Title>Lending</Title>
            </LinkBtn>
        </Wrapper>
    )
}

export default Dapp

const Wrapper = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const LinkBtn = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 55px;
  width: 70%;
  max-width: 250px;
  color: ${TmColors.WHITE};
  background: ${TmColors.LIGHT_BLUE};
  border-radius: 10px;
`

const Title = styled.span`
    margin-left: 10px;
`

const Divider = styled.div`
  margin: 35px 0;
`