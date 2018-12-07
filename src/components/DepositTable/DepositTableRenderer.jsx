// @flow
import React from 'react';
import { Button, Switch, Checkbox, InputGroup, Tag } from '@blueprintjs/core';
import {
  RowSpaceBetween,
  ColoredCryptoIcon,
  TokenIcon,
  Colors
} from '../Common';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import type { TokenData } from '../../types/tokens';

import type { Symbol } from '../../types/tokens';

type Props = {
  connected: boolean,
  baseTokensData: Array<TokenData>,
  quoteTokensData: Array<TokenData>,
  ETHTokenData: TokenData,
  WETHTokenData: TokenData,
  tokenDataLength: number,
  // provider: string,
  // depositTableData: Array<Object>,
  searchInput: string,
  handleSearchInputChange: (SyntheticEvent<>) => void,
  hideZeroBalanceToken: void => void,
  openDepositModal: string => void,
  openConvertModal: (string, string) => void,
  openSendModal: string => void,
  toggleAllowance: Symbol => void,
  toggleZeroBalanceToken: void => void,
  redirectToTradingPage: string => void
};

const DepositTableRenderer = (props: Props) => {
  const {
    hideZeroBalanceToken,
    toggleZeroBalanceToken,
    // depositTableData,
    searchInput,
    handleSearchInputChange,
    tokenDataLength
  } = props;
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
        <HideTokenCheck
          checked={hideZeroBalanceToken}
          onChange={toggleZeroBalanceToken}
        >
          Hide Tokens with 0 balance
        </HideTokenCheck>
      </RowSpaceBetween>
      <Table>
        <TableHeader>
          <Row>
            <TableHeaderCell>Token Name</TableHeaderCell>
            <TableHeaderCell>Balances</TableHeaderCell>
            <TableHeaderCell>Unlocked</TableHeaderCell>
            <TableHeaderCell style={{ width: '40%' }}>
              Allow trading
            </TableHeaderCell>
          </Row>
        </TableHeader>
      </Table>
      <TableBodyContainer>
        <Table>
          <TableBody>
            <ETHRow {...props} />
            <WETHRow {...props} />
            <QuoteTokenRows {...props} />
            <BaseTokenRows {...props} />
          </TableBody>
        </Table>
        {tokenDataLength === 0 && <NoToken>No tokens</NoToken>}
      </TableBodyContainer>
    </TableSection>
  );
};

const ETHRow = (props: Props) => {
  const {
    connected,
    ETHTokenData,
    openDepositModal,
    openSendModal,
    openConvertModal
  } = props;

  if (!ETHTokenData) return null;

  const { symbol, balance } = ETHTokenData;

  return (
    <Row key="ETH">
      <Cell>
        <TokenNameWrapper>
          <ColoredCryptoIcon size={30} color={Colors.BLUE5} name={symbol} />
          <span>{symbol}</span>
        </TokenNameWrapper>
      </Cell>
      <Cell>
        <div title={balance} style={{ maxWidth: 200 }}>
          <Ellipsis>{balance}</Ellipsis>
        </div>
      </Cell>
      <Cell />
      <Cell style={{ width: '40%' }}>
        <ButtonWrapper>
          <Button
            disabled={!connected}
            intent="primary"
            text="Deposit"
            rightIcon="import"
            onClick={() => openDepositModal(symbol)}
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            disabled={!connected}
            intent="primary"
            text="Send"
            rightIcon="export"
            onClick={() => openSendModal(symbol)}
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            disabled={!connected}
            intent="success"
            text="Convert to WETH"
            onClick={() => openConvertModal('ETH', 'WETH')}
            rightIcon="random"
          />
        </ButtonWrapper>
      </Cell>
    </Row>
  );
};

const WETHRow = (props: Props) => {
  const {
    connected,
    WETHTokenData,
    toggleAllowance,
    openDepositModal,
    openSendModal,
    openConvertModal
  } = props;

  if (!WETHTokenData) return null;

  const { symbol, balance, allowed, allowancePending } = WETHTokenData;

  return (
    <Row key="WETH">
      <Cell>
        <TokenNameWrapper>
          <ColoredCryptoIcon size={30} color={Colors.BLUE5} name={symbol} />
          <span>{symbol}</span>
        </TokenNameWrapper>
      </Cell>
      <Cell>
        <div title={balance} style={{ maxWidth: 200 }}>
          <Ellipsis>{balance}</Ellipsis>
        </div>
      </Cell>
      <Cell>
        <Switch
          inline
          checked={allowed}
          onChange={() => toggleAllowance(symbol)}
        />
        {allowancePending && (
          <Tag intent="success" large minimal interactive icon="time">
            Pending
          </Tag>
        )}
      </Cell>
      <Cell style={{ width: '40%' }}>
        <ButtonWrapper>
          <Button
            disabled={!connected}
            intent="primary"
            rightIcon="import"
            text="Deposit"
            onClick={() => openDepositModal(symbol)}
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            disabled={!connected}
            intent="primary"
            rightIcon="export"
            text="Send"
            onClick={() => openSendModal(symbol)}
          />
        </ButtonWrapper>
        <ButtonWrapper>
          <Button
            disabled={!connected}
            intent="success"
            text="Convert to ETH"
            rightIcon="random"
            onClick={() => openConvertModal('WETH', 'ETH')}
          />
        </ButtonWrapper>
      </Cell>
    </Row>
  );
};

const QuoteTokenRows = (props: Props) => {
  const {
    connected,
    quoteTokensData,
    toggleAllowance,
    openDepositModal,
    openSendModal
  } = props;

  if (!quoteTokensData) return null;

  return quoteTokensData.map(
    ({ symbol, balance, allowed, image, allowancePending }, index) => {
      return (
        <Row key={index}>
          <Cell>
            <TokenNameWrapper>
              <TokenIcon image={image} symbol={symbol} size={30} />
              <span>{symbol}</span>
            </TokenNameWrapper>
          </Cell>
          <Cell>
            <div title={balance} style={{ maxWidth: 200 }}>
              <Ellipsis>{balance}</Ellipsis>
            </div>
          </Cell>
          <Cell>
            <Switch
              inline
              checked={allowed}
              onChange={() => toggleAllowance(symbol)}
            />
            {allowancePending && (
              <Tag intent="success" large minimal interactive icon="time">
                Pending
              </Tag>
            )}
          </Cell>
          <Cell style={{ width: '40%' }}>
            <ButtonWrapper>
              <Button
                disabled={!connected}
                intent="primary"
                text="Deposit"
                rightIcon="import"
                onClick={() => openDepositModal(symbol)}
              />
            </ButtonWrapper>
            <ButtonWrapper>
              <Button
                disabled={!connected}
                intent="primary"
                text="Send"
                rightIcon="export"
                onClick={() => openSendModal(symbol)}
              />
            </ButtonWrapper>
          </Cell>
        </Row>
      );
    }
  );
};

const BaseTokenRows = (props: Props) => {
  const {
    baseTokensData,
    connected,
    toggleAllowance,
    openDepositModal,
    openSendModal,
    redirectToTradingPage
  } = props;

  if (!baseTokensData) return null;

  return baseTokensData.map(
    ({ symbol, balance, allowed, image, allowancePending }, index) => {
      return (
        <Row key={index}>
          <Cell>
            <TokenNameWrapper>
              <TokenIcon image={image} symbol={symbol} size={30} />
              <span>{symbol}</span>
            </TokenNameWrapper>
          </Cell>
          <Cell>
            <div title={balance} style={{ maxWidth: 200 }}>
              <Ellipsis>{balance}</Ellipsis>
            </div>
          </Cell>
          <Cell>
            <Switch
              inline
              checked={allowed}
              onChange={() => toggleAllowance(symbol)}
            />
            {allowancePending && (
              <Tag intent="success" large minimal interactive icon="time">
                Pending
              </Tag>
            )}
          </Cell>
          <Cell style={{ width: '40%' }}>
            <ButtonWrapper>
              <Button
                disabled={!connected}
                intent="primary"
                text="Deposit"
                rightIcon="import"
                onClick={() => openDepositModal(symbol)}
              />
            </ButtonWrapper>
            <ButtonWrapper>
              <Button
                disabled={!connected}
                intent="primary"
                text="Send"
                onClick={() => openSendModal(symbol)}
                rightIcon="export"
              />
            </ButtonWrapper>
            <ButtonWrapper>
              <Button
                disabled={!connected}
                intent="success"
                text="Trade"
                rightIcon="chart"
                onClick={() => redirectToTradingPage(symbol)}
              />
            </ButtonWrapper>
          </Cell>
        </Row>
      );
    }
  );
};

const Table = styled.table.attrs({
  className: 'bp3-html-table bp3-interactive bp3-html-table-striped'
})`
  width: 100%;
`;

const TableBodyContainer = styled.div`
  width: 100%;
  height: 80%;
  overflow-y: auto;
`;

const TableSection = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: column;
  height: 100%;
  width: 99%;
`;

const TableBody = styled.tbody``;

const TableHeader = styled.thead``;

const TableHeaderCell = styled.th`
  width: 19%;
`;
const Cell = styled.td`
  width: 19%;
  vertical-align: middle !important;
  & label {
    margin: 0;
  }
  & p {
    margin-bottom: 0;
  }
`;

const Row = styled.tr`
  width: 100%;
`;

const TokenNameWrapper = styled.div`
  display: flex;
  align-items: center;
  & svg,
  & img {
    margin-right: 12px;
  }
`;

const HideTokenCheck = styled(Checkbox)`
  margin: 0 !important;
`;

const NoToken = styled.p`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
`;

const ButtonWrapper = styled.span`
  margin-left: 10px !important;
  margin-right: 10px !important;
`;

const Ellipsis = styled.p`
  text-align: center;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default withRouter(DepositTableRenderer);
