import React from 'react'
import styled from 'styled-components'
import { Grid, Cell } from 'styled-css-grid'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'
import { Callout, InputGroup, Button, Spinner } from "@blueprintjs/core"
import { Link } from 'react-router-dom'

import { pricePrecision } from '../../config/tokens'
import { Theme, TmColors } from '../../components/Common'

import TokenSelect from '../../components/TokenSelect'
import DataTableHistory from '../../components/DataTableHistory'
import Pagination from '../../components/Pagination'

export default function WithdrawPageRenderer({ 
    token, 
    tokens, 
    handleChangeToken, 
    copyDataSuccess, 
    updateCurrentPair,
    withdrawHistory,
    handleChangeInput,
    handleWithdrawal,
    receiverAddress,
    withdrawalAmount,
    withdrawalAmountWithoutFee,
    error,
    dirty,
    total,
    handleChangePage,
    hash,
}) {  
    const columns = [
        {
            title: <FormattedMessage id="portfolioPage.depositWithdraw.table.coin" />,
            field: 'coin',
            width: '8%',
        },
        {
            title: <FormattedMessage id="portfolioPage.depositWithdraw.table.status" />,
            field: 'status',
            width: '12%',
        },
        {
            title: <FormattedMessage id="portfolioPage.depositWithdraw.table.amount" />,
            field: 'amount',
            width: '15%',
        },
        {
            title: <FormattedMessage id="portfolioPage.depositWithdraw.table.date" />,
            field: 'date',
            parents: null,
            width: '15%',
        },
        {
            title: <FormattedMessage id="portfolioPage.depositWithdraw.table.txHash" />,
            field: 'txHash',
            width: '25%',
        },
        {
            title: <FormattedMessage id="portfolioPage.depositWithdraw.table.recipientAddress" />,
            field: 'withdrawalAddress',
            width: '25%',
        },
    ]

    return (
        <Container>
            <MainTitle>
                <FormattedMessage id="portfolioPage.withdraw" />
                <InternalLink to={`/wallet/deposit/${token.symbol}`}><FormattedMessage id="portfolioPage.deposit" /></InternalLink>
            </MainTitle>

            <Grid
                columns={"1fr 1fr"} 
                gap="100px" 
            >
                <Cell>
                    <CoinBox>
                        <CoinTitle><FormattedMessage id="portfolioPage.coin" /></CoinTitle>
                        <TokenSelect 
                            token={token}
                            tokens={tokens}
                            onChange={handleChangeToken}
                        />
                    </CoinBox>
                    <BalanceRow>
                        <BalanceTitle><FormattedMessage id="portfolioPage.total" />:</BalanceTitle>
                        <BalanceValue>{BigNumber(token.balance).toFormat(pricePrecision)}</BalanceValue>
                    </BalanceRow>
                    <BalanceRow>
                        <BalanceTitle><FormattedMessage id="portfolioPage.availableAmount" />:</BalanceTitle> 
                        <BalanceValue>{BigNumber(token.availableBalance).toFormat(pricePrecision)}</BalanceValue>
                    </BalanceRow>
                    <BalanceRow>
                        <BalanceTitle><FormattedMessage id="portfolioPage.inOrders" />:</BalanceTitle>
                        <BalanceValue>{BigNumber(token.inOrders).toFormat(pricePrecision)}</BalanceValue>
                    </BalanceRow>

                    <NoteBox intent="danger">
                        <NoteItem><FormattedMessage id="portfolioPage.withdraw.warning1" /></NoteItem>
                        <NoteItem><FormattedMessage id="portfolioPage.withdraw.warning2" /></NoteItem>
                    </NoteBox>
                </Cell>
                <Cell>
                    <InputBox>
                        <InputLabel>
                            <FormattedMessage 
                                id="portfolioPage.withdraw.recipientAddress"
                                values={{symbol: token.symbol}}
                            />
                        </InputLabel>

                        <InputGroupWrapper
                            status={error.address === 'invalid' && dirty.address ? 'invalid' : 'valid'}
                            name="address"
                            onChange={handleChangeInput}
                            value={receiverAddress}
                            autoComplete="off"
                        />
                    </InputBox>

                    <InputBox>
                        <InputLabel>
                            <FormattedMessage id="portfolioPage.withdraw.amount" />
                        </InputLabel>

                        <InputGroupWrapper
                            status={error.amount === 'invalid' && dirty.amount ? 'invalid' : 'valid'}
                            name="amount"
                            type="number"
                            onChange={handleChangeInput}
                            value={withdrawalAmount}
                            autoComplete="off"
                        />
                    </InputBox>
                    <WithdrawInfo>
                        <SmallText><FormattedMessage id="portfolioPage.withdraw.minimumWithdrawal" />: <BalanceValue>{token.minimumWithdrawal}</BalanceValue> {token.symbol}</SmallText>
                        <SmallText><FormattedMessage id="portfolioPage.availableAmount" />: <BalanceValue>{BigNumber(token.availableBalance).toFormat(pricePrecision)}</BalanceValue> {token.symbol}</SmallText>
                    </WithdrawInfo>
                    <TextRow><SmallText><FormattedMessage id="portfolioPage.withdraw.withdrawalFee" />: <BalanceValue>{token.withdrawFee}</BalanceValue> {token.symbol}</SmallText></TextRow>
                    <TextRow><SmallText><FormattedMessage id="portfolioPage.withdraw.youWillGet" />: <AmountWithoutFee>{withdrawalAmountWithoutFee}</AmountWithoutFee> {token.symbol}</SmallText></TextRow>
                    
                    <ButtonWrapper
                        text={<ButtonContent>
                                <FormattedMessage id="portfolioPage.withdraw" /> 
                                {hash && <SpinnerStyled intent="warning" size={Spinner.SIZE_SMALL} />}
                            </ButtonContent>}
                        intent="primary"
                        large
                        type="submit"
                        fill
                        disabled={(error.address === 'invalid') || (error.amount === 'invalid') || !!hash}
                        onClick={handleWithdrawal}
                    />
                </Cell>
            </Grid>

            <History>
                <SubTitle><FormattedMessage id="portfolioPage.withdraw.recentWithdrawal" /></SubTitle>
                <DataTableHistory 
                    columns={columns} 
                    data={withdrawHistory}
                />
                <Pagination
                    totalItems={total}
                    itemsPerPage={5}
                    onChangePage={handleChangePage}
                />
            </History>
        </Container>
    )
}

const Container = styled.div`
    height: 100%;
    width: 100%;

    .bp3-popover-wrapper,
    .bp3-popover-target {
        display: block;
    }

    .token-select-btn {
        display: flex;
        justify-content: space-between;
    }
`

const MainTitle = styled.h1`
    font-size: ${Theme.FONT_SIZE_H1};
    font-weight: 400;
    margin-bottom: 40px;
`

const SubTitle = styled.h1`
    font-size: ${Theme.FONT_SIZE_H2};
    font-weight: 400;
    margin-top: 30px;
    margin-bottom: 25px;
`

const InternalLink = styled(Link)`
    font-size: ${Theme.FONT_SIZE_SM};
    color: ${props => props.theme.mainColorHover};

    &:hover {
        color: ${TmColors.ORANGE};
    }

    &::before {
        content: "";
        border-right: 1px solid ${props => props.theme.borderColor};
        height: 40px;
        margin: 0 25px;
        color: ${props => props.theme.mainColor};
    }
`

const SmallText = styled.span`
    font-size: ${Theme.FONT_SIZE_SM};
`

const CoinBox = styled.div`
    max-width: 450px;
    margin-bottom: 25px;
`

const TextRow = styled.div`
    margin-bottom: 7px;
`

const CoinTitle = styled(TextRow)``

const BalanceRow = styled(TextRow)``

const BalanceTitle = styled.span`
    display: inline-block;
    min-width: 160px;
`

const BalanceValue = styled.span`
    font-family: ${Theme.FONT_FAMILY_UBUNTU};
`

const NoteBox = styled(Callout)`
    margin-top: 45px;

    &.bp3-callout,
    h4.bp3-heading {
        font-size: ${Theme.FONT_SIZE_SM} !important;
    }
`

const NoteItem = styled(TextRow)``

const History = styled.section``

const InputBox = styled.div`
    margin-bottom: 25px;
`

const InputLabel = styled.div`
    user-select: none;
    margin-bottom: 7px;
`

const InputGroupWrapper = styled(InputGroup).attrs({
    className: "bp3-fill",
})`
    .bp3-input {
        font-family: 'Ubuntu', sans-serif;
        font-size: ${Theme.FONT_SIZE_SM};
        color: ${props => props.theme.inputColor};
        height: unset;
        padding: 5px 10px;
        background-color: ${props => props.theme.inputBackground};
        box-shadow: ${props => props.status === 'invalid' ? '0 0 0 1px '+ TmColors.RED + ' !important' : 'none'};
    }
`

const WithdrawInfo = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 7px;
`

const ButtonWrapper = styled(Button)`
    display: block;
    margin: 35px auto 0;
    min-width: 180px;
    text-align: center;
    background-color: ${TmColors.ORANGE} !important;
    box-shadow: none !important;
    background-image: none !important;
    height: 40px;

    &:hover {
        background-color: ${TmColors.DARK_ORANGE} !important;
    }

    &.bp3-disabled {
        cursor: default !important;
        background-color: ${TmColors.BLUE} !important;
    }

    .bp3-button-text {
        font-size: ${Theme.FONT_SIZE_MD};
    }
`

const ButtonContent = styled.div`
    display: flex;
`

const AmountWithoutFee = styled(BalanceValue)`
    color: ${TmColors.ORANGE};
    font-weight: 600;
    align-items: center;
`

const SpinnerStyled = styled(Spinner)`
    margin-left: 15px;
`