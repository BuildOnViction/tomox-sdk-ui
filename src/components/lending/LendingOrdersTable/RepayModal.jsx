import React from 'react'
import { Button } from '@blueprintjs/core'
import styled from 'styled-components'

import Modal from '../../Modal'

export default function RepayModal({ 
    hash, 
    onRepay,
    onClose, 
    ...rest 
}) {
    return (
        <Modal onClose={() => onClose(false)} {...rest}>
            <Typo>Note: you are repaying your borrowing before the pay-off date, it could make you have to imposed more 1&#37; fee</Typo>
            <Typo>Total repay amount: __ USDT</Typo>
            <ButtonGroup>
                <CancelButton 
                    text="No, let me pay later"
                    onClick={() => onClose(false)}
                />
                <RepayButton 
                    onClick={() => onRepay(hash)} 
                    text="Yes, I want to repay you" 
                />
            </ButtonGroup>
        </Modal>
    )
}

const ButtonGroup = styled.div`
    display: flex;
    justify-content: space-between;
`

const BaseButton = styled(Button)`
    width: 47%;
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    color: #fff !important;
    box-shadow: none !important;
    background-image: none !important;
`

const CancelButton = styled(BaseButton)`
    background-color: #3f4a67 !important;
    &:hover {
        background-color: #333c54 !important;
    }
`

const RepayButton = styled(BaseButton)`
    color: #18454e !important
    background-color: #00e8b5 !important;
    &:hover {
        background-color: #00c59a !important;
    }
`

const Typo = styled.p`
    margin-bottom: 25px;
`