import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'
import QRCode from 'qrcode.react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Callout } from "@blueprintjs/core"

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
            width: '20%',
        },
        {
            title: <FormattedMessage id="portfolioPage.depositWithdraw.table.status" />,
            field: 'status',
            width: '40%',
        },
        {
            title: <FormattedMessage id="portfolioPage.depositWithdraw.table.amount" />,
            field: 'amount',
            width: '40%',
        },
    ]

    return (
        <Container>
            <Row>
                <CoinBox>
                    <CoinTitle><FormattedMessage id="portfolioPage.coin" /></CoinTitle>
                    <TokenSelect 
                        token={token}
                        tokens={tokens}
                        onChange={handleChangeToken}
                    />
                </CoinBox>
            </Row>
            <Row>
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
                <NoteBox intent="danger" icon={null}>
                    <NoteItem><FormattedMessage id="portfolioPage.deposit.warning1" /> <strong style={{fontFamily: 'Ubuntu'}}>{token.minimumWithdrawal && token.minimumWithdrawal}</strong> { token.symbol }</NoteItem>
                    <NoteItem>
                        <FormattedMessage 
                            id="portfolioPage.deposit.warning2" 
                            values={{ symbol: token.symbol }}
                        />
                    </NoteItem>
                </NoteBox>
            </Row>
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
    padding: 0 10px;

    .bp3-popover-wrapper,
    .bp3-popover-target {
        display: block;
    }

    .token-select-btn {
        display: flex;
        justify-content: space-between;
    }
`

const Row = styled.div``

const SubTitle = styled.h4`
    font-size: ${Theme.FONT_SIZE_MD};
    font-weight: 400;
    margin-top: 30px;
    margin-bottom: 15px;
`

const CoinBox = styled.div`
    max-width: 450px;
    margin-bottom: 25px;
`

const TextRow = styled.div`
    margin-bottom: 7px;
`

const CoinTitle = styled(TextRow)`
    font-size: ${Theme.FONT_SIZE_MD};
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