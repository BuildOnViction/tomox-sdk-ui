import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'

import { ButtonGroup, CancelButton, AcceptButton, Highlight } from '../../Common'
import Modal from '../../Modal'
import { lendingAmountPrecision } from '../../../config/tokens'

export default function RepayModal({ 
    trade,
    realInterest,
    lendingToken,
    onRepay,
    onClose,
    ...rest 
}) {
    return (
        <Modal onClose={() => onClose(false)} {...rest}>
            <Typo>Note: you are repaying your borrowing before the pay-off date, it could make you have to imposed more fee</Typo>
            <RepayContent>
                <Typo>Loan amount: <span><Value>{BigNumber(trade.amount).toFormat(lendingAmountPrecision)}</Value> USDT</span></Typo>
                <Typo>Estimated interest: <span><Value>{BigNumber(realInterest).toFormat(lendingAmountPrecision)}</Value> USDT</span></Typo>
                <Typo>Total repay amount: <Highlight><Value>{BigNumber(Number(trade.amount) + Number(realInterest)).toFormat(lendingAmountPrecision)}</Value> USDT</Highlight></Typo>
                <Typo>Available balance: <span><Value>{BigNumber(lendingToken.availableBalance).toFormat(lendingAmountPrecision)}</Value> USDT</span></Typo>
            </RepayContent>
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

const RepayContent = styled.div`
    margin-top: 20px;
    margin-bottom: 35px;
`

const Typo = styled.p`
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
`

const Value = styled.span`
    font-family: 'Ubuntu', sans-serif;
`

