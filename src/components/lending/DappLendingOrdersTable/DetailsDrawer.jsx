import React from 'react'
import styled from 'styled-components'
import {
    Drawer,
    Position,
  } from '@blueprintjs/core'
import { FormattedMessage } from 'react-intl'
import BigNumber from 'bignumber.js'

import { Theme } from '../../Common'
import { formatDate } from '../../../utils/helpers'

const TRADE_STATUS = {
    'OPEN': <FormattedMessage id='exchangePage.open' />,
    'CLOSED': <FormattedMessage id='exchangeLendingPage.orders.trade.closed' />,
    'LIQUIDATED': <FormattedMessage id='exchangeLendingPage.orders.trade.liquidated' />,
}

const ORDERTYPES = {
    'LO': <FormattedMessage id='exchangePage.limit' />,
    'MO': <FormattedMessage id='exchangePage.market' />,
}

const TOPUPTYPES = {
    '0': 'Manual',
    '1': 'Auto',
}

export default function DetailsDrawer({item, onClose, renderSideIcon}) {
    return (
        <Drawer
            title="Details"
            onClose={onClose}
            autoFocus={true}
            canOutsideClickClose={true}
            hasBackdrop={true}
            isOpen={!!item}
            position={Position.RIGHT}
            size="70%"
            usePortal={false}
            >
            {item && (
                <Container>
                    <Header>
                        <span>{renderSideIcon(item.side)}{`${item.termSymbol}/${item.lendingTokenSymbol}`}</span>
                        <Value>{BigNumber(item.interest).toFormat(2)}&#37;</Value>
                    </Header>

                    <Row>
                        <Label><FormattedMessage id="exchangeLendingPage.orders.openDate" /></Label>
                        <Value>{formatDate(item.time, 'LL-dd HH:mm:ss')}</Value>
                    </Row>
                    <Row>
                        <Label><FormattedMessage id="exchangeLendingPage.orders.closeDate" /></Label> 
                        <Value>{formatDate(item.updatedAt, 'LL-dd HH:mm:ss')}</Value>
                    </Row>
                    <Row>
                        <Label><FormattedMessage id="exchangePage.type" /></Label>
                        <Value>{ORDERTYPES[item.type]}-{TOPUPTYPES[item.autoTopUp]}</Value>
                    </Row>
                    <Row>
                        <Label><FormattedMessage id="exchangePage.amount" /></Label> 
                        <Value>{BigNumber(item.amount).toFormat()} {item.lendingTokenSymbol}</Value>
                    </Row>
                    <Row>
                        <Label><FormattedMessage id="exchangeLendingPage.orders.collateral" /></Label> 
                        <Value>{BigNumber(item.collateralLockedAmount).toFormat()} {item.collateralTokenSymbol}</Value>
                    </Row>
                    <Row>
                        <Label><FormattedMessage id="exchangeLendingPage.orders.liqPrice" /></Label> 
                        <Value>
                        {BigNumber(item.liquidationPrice).toFormat(item.liquidationPricePrecision)}&nbsp;
                        {`${item.collateralTokenSymbol}/${item.lendingTokenSymbol}`}
                        </Value>
                    </Row>
                    <Row>
                        <Label><FormattedMessage id="exchangePage.status" /></Label>
                        <Value>{TRADE_STATUS[item.status]}</Value>
                    </Row>
                </Container>
            )}
        </Drawer>
    )
}

const Container = styled.div`
  padding: 10px;
`

const Header = styled.div`
  color: #fff;
  font-size: ${Theme.FONT_SIZE_MD};
  margin-bottom: 5px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`

const Label = styled.span``

const Value = styled.span`
  color: #9ca4ba;
  font-size: ${Theme.FONT_SIZE_SM};
`