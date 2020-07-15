import React from 'react'
import styled from 'styled-components'
import { Grid, Cell } from 'styled-css-grid'
import { FormattedMessage } from 'react-intl'
import QRCode from 'qrcode.react'
import BigNumber from 'bignumber.js'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Callout } from "@blueprintjs/core"
import { Link } from 'react-router-dom'

import { pricePrecision } from '../../config/tokens'
import { Theme, TmColors } from '../../components/Common'

import TokenSelect from '../../components/TokenSelect'
import DataTableHistory from '../../components/DataTableHistory'
import Pagination from '../../components/Pagination'

export default function DepositRenderer({ 
    token, 
    tokens, 
    handleChangeToken, 
    copyDataSuccess, 
    depositHistory,
    updateCurrentPair,
    total,
    handleChangePage,
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
            width: '16%',
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
            width: '23%',
        },
        {
            title: <FormattedMessage id="portfolioPage.depositWithdraw.table.depositAddress" />,
            field: 'depositAddress',
            width: '23%',
        },
    ]

    return (
        <Container>
            <MainTitle>
                <FormattedMessage id="portfolioPage.deposit" />
                <InternalLink to={`/wallet/withdraw/${token.symbol}`}><FormattedMessage id="portfolioPage.withdraw" /></InternalLink>
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

                    <TradeBox>
                        <TradeTitle><FormattedMessage id="portfolioPage.deposit.goToTrade" />:</TradeTitle>
                        <div>
                            {
                                token.pairs.map((pair, index) => <PairLink key={index} onClick={() => updateCurrentPair(pair)}>{pair}</PairLink>)
                            }
                        </div>
                    </TradeBox>
                </Cell>
                <Cell>
                    <AddressRow>
                        <FormattedMessage
                            id="portfolioPage.deposit.sendToAddress"
                            values={{ symbol: token.symbol === "USDT" ? `${token.symbol} (ERC20)` : token.symbol }}
                        />
                    </AddressRow>
                    <AddressBox>
                        <QrRow>{token.depositAddress && <QRCode value={token.depositAddress} size={150} includeMargin={true} />}</QrRow>
                        <AddressRow><Address>{token.depositAddress}</Address></AddressRow>
                        <CopyToClipboard text={token.depositAddress} onCopy={copyDataSuccess}>
                            <CopyButton><i className="fa fa-clone" aria-hidden="true"></i> <FormattedMessage id="portfolioPage.deposit.copy" /></CopyButton>
                        </CopyToClipboard>
                    </AddressBox>
                    <NoteBox intent="danger" title="Note">
                        <NoteItem><FormattedMessage id="portfolioPage.deposit.warning1" /> <strong style={{fontFamily: 'Ubuntu'}}>{token.minimumWithdrawal && token.minimumWithdrawal}</strong> { token.symbol }</NoteItem>
                        <NoteItem>
                            <FormattedMessage 
                                id="portfolioPage.deposit.warning2" 
                                values={{ symbol: token.symbol }}
                            />
                        </NoteItem>
                    </NoteBox>
                </Cell>
            </Grid>

            <DepositHistory>
                <SubTitle><FormattedMessage id="portfolioPage.deposit.recentDeposit" /></SubTitle>
                <DataTableHistory columns={columns} data={depositHistory} />
                <Pagination
                    totalItems={total}
                    itemsPerPage={5}
                    onChangePage={handleChangePage}
                />
            </DepositHistory>
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

const AddressBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 30px 0 20px 0;
`

const AddressRow = styled(TextRow)``

const QrRow = styled(TextRow)`
    min-height: 150px;
`

const Address = styled.span`
    color: ${TmColors.ORANGE};
    font-family: ${Theme.FONT_FAMILY_UBUNTU} !important;
`

const CopyButton = styled.div`
    border: 1px solid ${props => props.theme.border};
    border-radius: 3px;
    padding: 7px 17px;
    cursor: pointer;
`

const NoteBox = styled(Callout)`
    &.bp3-callout,
    h4.bp3-heading {
        font-size: ${Theme.FONT_SIZE_SM} !important;
    }
`

const NoteItem = styled(TextRow)``

const DepositHistory = styled.section``

const TradeBox = styled.div`
    margin-top: 45px;
`

const TradeTitle = styled.div`
    margin-bottom: 7px;
`

const PairLink = styled.span`
    cursor: pointer;
    margin-right: 15px;
    text-decoration: underline;

    &:hover {
        color: ${TmColors.ORANGE};
    }
`