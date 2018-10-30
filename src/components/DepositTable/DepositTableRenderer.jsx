// @flow
import React from 'react'
import { Button, Switch, Checkbox, InputGroup } from '@blueprintjs/core'
import { RowSpaceBetween, ColoredCryptoIcon, ImageIcon } from '../Common'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

// import type { TokenImage } from '../../types/tokens';

type Props = {
  provider: string,
  depositTableData: Array<Object>,
  searchInput: string,
  handleSearchInputChange: (SyntheticEvent<>) => void,
  hideZeroBalanceToken: void => void,
  openDepositModal: string => void,
  openSendModal: string => void,
  toggleAllowance: void => void,
  toggleZeroBalanceToken: void => void,
  redirectToTradingPage: string => void
}

const DepositTableRenderer = (props: Props) => {
  const { hideZeroBalanceToken, toggleZeroBalanceToken, depositTableData, searchInput, handleSearchInputChange } = props
  return (
    <TableSection>
      <RowSpaceBetween style={{ marginBottom: '10px' }}>
        <InputGroup
          type="string"
          leftIcon="search"
          placeholder="Search Token ..."
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <HideTokenCheck checked={hideZeroBalanceToken} onChange={toggleZeroBalanceToken}>
          Hide Tokens with 0 balance
        </HideTokenCheck>
      </RowSpaceBetween>
      <Table>
        <TableHeader>
          <Row>
            <TableHeaderCell>Token Name</TableHeaderCell>
            <TableHeaderCell>Balances</TableHeaderCell>
            <TableHeaderCell>Allowances</TableHeaderCell>
            <TableHeaderCell style={{ width: '40%' }}>Allow trading</TableHeaderCell>
          </Row>
        </TableHeader>
      </Table>
      <TableBodyContainer>
        <Table>
          <TableBody>
            <RowRenderer {...props} />
          </TableBody>
        </Table>
        {depositTableData.length === 0 && <NoToken>No tokens</NoToken>}
      </TableBodyContainer>
    </TableSection>
  )
}

const RowRenderer = (props: Props) => {
  const { provider, depositTableData, toggleAllowance, openDepositModal, openSendModal, redirectToTradingPage } = props
  // if has image url then return image else return svg from icon

  return depositTableData.map(({ symbol, image, balance, allowed, allowancePending }, index) => {
    return (
      <Row key={index}>
        <Cell>
          <TokenNameWrapper>
            {image && image.url ? (
              <ImageIcon alt={image.meta} src={image.url} size={35} />
            ) : (
              <ColoredCryptoIcon size={35} name={symbol} />
            )}

            <span>{symbol}</span>
          </TokenNameWrapper>
        </Cell>
        <Cell>
          <div title={balance} style={{ maxWidth: 200 }}>
            <Ellipsis>{balance}</Ellipsis>
          </div>
        </Cell>
        <Cell>
          <Switch inline checked={allowed} onChange={() => toggleAllowance(symbol)} />
          {allowancePending && <span>Pending</span>}
        </Cell>
        <Cell style={{ width: '40%' }}>
          <ButtonWrapper>
            <Button disabled={!provider} intent="primary" text="Deposit" onClick={() => openDepositModal(symbol)} />
          </ButtonWrapper>
          <ButtonWrapper>
            <Button disabled={!provider} intent="primary" text="Send" onClick={() => openSendModal(symbol)} />
          </ButtonWrapper>
          <ButtonWrapper>
            <Button disabled={!provider} intent="primary" text="Trade" onClick={() => redirectToTradingPage(symbol)} />
          </ButtonWrapper>
        </Cell>
      </Row>
    )
  })
}

const Table = styled.table.attrs({
  className: 'bp3-html-table bp3-interactive bp3-html-table-striped'
})`
  width: 100%;
`

const TableBodyContainer = styled.div`
  width: 100%;
  height: 80%;
  overflow-y: scroll;
`

const TableSection = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: column;
  height: 100%;
  width: 99%;
`

const TableBody = styled.tbody``

const TableHeader = styled.thead``

const TableHeaderCell = styled.th`
  width: 19%;
`
const Cell = styled.td`
  width: 19%;
  vertical-align: middle !important;
  & label {
    margin: 0;
  }
`

const Row = styled.tr`
  width: 100%;
`

const TokenNameWrapper = styled.div`
  display: flex;
  align-items: center;
  & svg,
  & img {
    margin-right: 12px;
  }
`

const HideTokenCheck = styled(Checkbox)`
  margin: 0 !important;
`

const NoToken = styled.p`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
`

const ButtonWrapper = styled.span`
  margin-left: 10px !important;
  margin-right: 10px !important;
`

const Ellipsis = styled.p`
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export default withRouter(DepositTableRenderer)
