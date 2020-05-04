import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { FormattedMessage } from 'react-intl'

import { ButtonGroup, CancelButton, AcceptButton, Highlight, TmColors } from '../../Common'
import Modal from '../../Modal'
import { lendingAmountPrecision } from '../../../config/tokens'

export default function RepayModal({ 
    trade,
    realInterest,
    totalRepay,
    errorRepay,
    lendingToken,
    onRepay,
    onClose,
    ...rest 
}) {
    return (
        <Modal onClose={() => onClose(false)} {...rest}>
            <Typo><FormattedMessage id="exchangeLendingPage.orders.repayModal.note" /></Typo>
            <RepayContent>
                <Typo><FormattedMessage id="exchangeLendingPage.orders.repayModal.loan" /> <span><Value>{BigNumber(trade.amount).toFormat(lendingAmountPrecision)}</Value> {lendingToken.symbol}</span></Typo>
                <Typo><FormattedMessage id="exchangeLendingPage.orders.repayModal.interest" /> <span><Value>{BigNumber(realInterest).toFormat(lendingAmountPrecision)}</Value> {lendingToken.symbol}</span></Typo>
                <Typo><FormattedMessage id="exchangeLendingPage.orders.repayModal.total" /> <Highlight><Value>{BigNumber(totalRepay).toFormat(lendingAmountPrecision)}</Value> {lendingToken.symbol}</Highlight></Typo>
                <Typo><FormattedMessage id="exchangeLendingPage.orders.repayModal.availableBalance" /> <span><Value>{BigNumber(lendingToken.availableBalance).toFormat(lendingAmountPrecision)}</Value> {lendingToken.symbol}</span></Typo>
                {errorRepay && (<Highlight color={TmColors.RED}><FormattedMessage id="exchangeLendingPage.orders.repayModal.noReplay" /></Highlight>)}
            </RepayContent>
            <ButtonGroup>
                <CancelButton 
                    width="47%"
                    text={<FormattedMessage id="exchangeLendingPage.orders.repayModal.noReplay" />}
                    onClick={() => onClose(false)}
                />
                <AcceptButton 
                    width="47%"
                    onClick={onRepay} 
                    text={<FormattedMessage id="exchangeLendingPage.orders.repayModal.yesReplay" />} 
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

