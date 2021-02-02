// @flow
import React from 'react'
import styled from 'styled-components'
import { Icon } from '@blueprintjs/core'
import { CancelButton } from '../../../components/Common'
import Modal from '../../../components/Modal'

export default function WarningModal({ open, hideWarning }) {
    return (
        <Modal isOpen={open} className="sm">
            <WarningContent>
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
            </WarningContent>
        </Modal>
    )
}

const WarningContent = styled.div`
  padding: 35px 25px 40px;
`

const WarningRow = styled.div`
  color: #f94d5c;
  font-weight: 600;
  text-align: center;
  line-height: 1.5em;
  margin-bottom: 20px;
`

const UnderstandButton = styled(CancelButton)`
  margin-top: 30px;
`