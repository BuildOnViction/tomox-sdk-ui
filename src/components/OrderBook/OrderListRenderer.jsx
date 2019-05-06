// @flow
import React from 'react';
import styled from 'styled-components';
import { Loading, Colors } from '../Common';
import { ResizableBox } from 'react-resizable';

type BidOrAsk = {
  price: number,
  amount: number,
  total: number
};

type Props = {
  bids: Array<BidOrAsk>,
  asks: Array<BidOrAsk>
};

export const OrderBookRenderer = (props: Props) => {
  const { bids, asks } = props;
  return (
    <React.Fragment>
      <ResizableBox height={500} width={Infinity}>
        <OrderBookBox>
          {!bids && <Loading />}
          {bids && (
            <ListContainer className="list-container">
              <ListHeading>
                <HeaderRow>
                  <HeaderCell>TOTAL</HeaderCell>
                  <HeaderCell>AMOUNT</HeaderCell>
                  <HeaderCell>PRICE</HeaderCell>
                </HeaderRow>
              </ListHeading>
              <List className="bp3-list-unstyled list">
                {bids.map((order, index) => (
                  <BuyOrder key={index} index={index} order={order} />
                ))}
              </List>
            </ListContainer>
          )}
          {asks && (
            <ListContainer className="list-container left-list">
              <ListHeading>
                <HeaderRow>
                  <HeaderCell>PRICE</HeaderCell>
                  <HeaderCell>AMOUNT</HeaderCell>
                  <HeaderCell>TOTAL</HeaderCell>
                </HeaderRow>
              </ListHeading>
              <List className="bp3-list-unstyled list">
                {asks.map((order, index) => (
                  <SellOrder key={index} index={index} order={order} />
                ))}
              </List>
            </ListContainer>
          )}
        </OrderBookBox>
      </ResizableBox>
    </React.Fragment>
  );
};

export type SingleOrderProps = {
  order: Object,
  index: number
};

const BuyOrder = (props: SingleOrderProps) => {
  const { order } = props;
  return (
    <Row>
      <BuyRowBackground amount={order.relativeTotal} />
      <Cell style={{ width: '20%' }}>{order.total}</Cell>
      <Cell style={{ width: '20%' }}>{order.amount}</Cell>
      <Cell>{order.price}</Cell>
    </Row>
  );
};

const SellOrder = (props: SingleOrderProps) => {
  const { order, index } = props;
  return (
    <Row key={index}>
      <SellRowBackGround amount={order.relativeTotal} />
      <Cell>{order.price}</Cell>
      <Cell>{order.amount}</Cell>
      <Cell>{order.total}</Cell>
    </Row>
  );
};

const OrderBookBox = styled.div.attrs({})`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: stretch;
`;
const ListContainer = styled.div`
  height: 91%;
  width: 100%;
`;
const List = styled.ul`
  height: 90%;
  max-height: 500px;
  overflow-y: auto;
`;

const Row = styled.li.attrs({
  className: 'row'
})`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  width: 100%;
  margin: 0px !important;
  padding: 5px 10px !important;
  border: 1px transparent;
  border-radius: 2px;
  box-shadow: inset 0px 1px 0 0 rgba(16, 22, 26, 0.15);

  &:hover {
    background-color: ${Colors.BLUE_MUTED};
    position: relative;
    border-radius: 3px;
    -webkit-box-shadow: inset 0 0 0 1px rgb(49, 64, 76),
      -1px 10px 4px rgba(16, 22, 26, 0.1), 1px 18px 24px rgba(16, 22, 26, 0.2);
    box-shadow: inset 0 0 0 1px rgb(49, 64, 76),
      -1px 5px 4px rgba(16, 22, 26, 0.1), 1px 7px 24px rgba(16, 22, 26, 0.2);
    z-index: 1;
  }
`;

const SellRowBackGround = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: ${props => 100 * props.amount}% !important;
  background-color: ${Colors.SELL_MUTED} !important;
  z-index: 1;
`;

const BuyRowBackground = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: ${props => 100 * props.amount}% !important;
  background-color: ${Colors.BUY_MUTED} !important;
  z-index: 1;
`;

const Cell = styled.span`
  min-width: 35px;
`;

const ListHeading = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 0px;
  padding-left: 10px !important;
`;

const HeaderRow = styled.li`
  display: flex;
  justify-content: space-between;
  margin: 0px !important;
  padding-bottom: 10px;
  width: 100%;
  span {
    font-weight: 600;
  }
`;

const HeaderCell = styled.span`
  width: 20%;
`;

export default OrderBookRenderer;
