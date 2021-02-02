import React from 'react'
import styled from 'styled-components'
import { Icon } from '@blueprintjs/core'

import { CancelButton } from '../../../components/Common'

export default function({ hideWarning }) {
    return (
        <Container>
            <WarningRow>
                <Icon icon="warning-sign" color="#f94d5c" iconSize="30" />
            </WarningRow>
            <WarningRow>
                TomoDEX Lending temporarily closed from 8 AM (UTC) 3 Feb 2021.
            </WarningRow>
            <WarningRow>
                <UnderstandButton 
                    width="55%"
                    onClick={hideWarning} 
                    text="I understand" 
                />
            </WarningRow>
        </Container>
    )
}

const Container = styled.div`
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 110;
    background: ${props => props.theme.mainBg};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 30px;
`

const WarningRow = styled.div`
  color: #f94d5c;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  line-height: 1.3rem;
  margin-bottom: 20px;
  width: 100%;
`

const UnderstandButton = styled(CancelButton)`
  margin-top: 30px;
`