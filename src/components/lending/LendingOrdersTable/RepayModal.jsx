import React from 'react'
import styled from 'styled-components'

import { ButtonGroup, CancelButton, AcceptButton, Highlight } from '../../Common'
import Modal from '../../Modal'

export default function RepayModal({ 
    trade,
    onRepay,
    onClose, 
    ...rest 
}) {
    return (
        <Modal onClose={() => onClose(false)} {...rest}>
            <Typo>Note: you are repaying your borrowing before the pay-off date, it could make you have to imposed more 1&#37; fee</Typo>
            <Typo>Total repay amount: <Highlight>{trade && trade.amount} USDT</Highlight></Typo>
            <ButtonGroup>
                <CancelButton 
                    width="47%"
                    text="No, let me pay later"
                    onClick={() => onClose(false)}
                />
                <AcceptButton 
                    width="47%"
                    onClick={onRepay} 
                    text="Yes, I want to repay you" 
                />
            </ButtonGroup>
        </Modal>
    )
}

const Typo = styled.p`
    margin-bottom: 25px;
`