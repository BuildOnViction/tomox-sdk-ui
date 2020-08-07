import React from 'react'
import styled from 'styled-components'
import { FormattedMessage } from 'react-intl'

import { formatDate } from '../../utils/helpers'
import { TmColors, Theme } from '../../components/Common'

const STATUS = {
    PROCESSING: <FormattedMessage id="portfolioPage.depositWithdraw.status.processing" />,
    COMPLETED: <FormattedMessage id="portfolioPage.depositWithdraw.status.completed" />,
}

function renderHeader(columns, widths) {
    return (
        <Row widths={widths}>
            { columns.map((column, index) => <CellHeader key={index} width={column.width}>{ column.title }</CellHeader>) }
        </Row>
    )
}

function renderCell(item, field) {
    switch (field) {
        case 'txHash':
            return (<ExteralLink href={`${item.scanUrl}tx/${item[field]}`} target="_blank">
                        <i className="fa fa-external-link" aria-hidden="true" />
                    </ExteralLink>)
        case 'coin':
            return (
                <>
                    <MainInfo>{item[field]} {item['amount']}</MainInfo>
                    <Date><SmallText>{formatDate(Number(item['date']) * 1000, 'Y-LL-dd HH:mm:ss')}</SmallText></Date>
                </>
            )
        case 'status':
            if (item.tokenConfirmations && item['status'] === 'PROCESSING') {
                return (<SmallText>{STATUS[item['status']]} {`(${item.confirmations}/${item.tokenConfirmations})`}</SmallText>)
            }
            
            return <SmallText>{STATUS[item['status']]}</SmallText>
        default:
            return item[field]
    }
}

function renderBody(columns, data, widths) {
    if (data.length === 0) return (<NoData><FormattedMessage id="exchangePage.noData" /></NoData>)

    return (
        data.map((item, index) => {
            return (
                <Row key={index} widths={widths}>
                    {
                        columns.map((column, index) => {
                            return (
                                <Cell key={index} width={column.width}>
                                    {
                                        renderCell(item, column.field)
                                    }
                                </Cell>
                            )
                        })
                    }
                </Row>
            )
        })
    )
}

export default function TableData({ columns, data }) {
    const widths = columns.map(column => column.width).join(' ')
    
    return (
        <Table>
            { renderHeader(columns, widths) }
            { renderBody(columns, data, widths) }
        </Table>
    )
}

const Table = styled.div``

const Row = styled.div`
    display: grid;
    grid-template-columns: ${props => props.widths}

    &:nth-child(2n) {
        background-color: ${props => props.theme.subBg};
    }
`

const Cell = styled.div`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 15px;
`

const ExteralLink = styled.a`
    color: ${props => props.theme.mainColor};
    text-decoration: underline;

    &:hover {
        color: ${TmColors.ORANGE};
    }
`

const CellHeader = styled(Cell)``

const NoData = styled.div`
    text-align: center;
    margin-top: 45px;
    margin-bottom: 45px;
`

const SmallText = styled.span`
    font-size: ${Theme.FONT_SIZE_XS};
`

const MainInfo = styled.div`
    color: ${TmColors.WHITE};
`

const Date = styled.div``