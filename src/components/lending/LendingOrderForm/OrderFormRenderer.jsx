// @flow
import React from 'react'
import styled from 'styled-components'

import {
  SpinnerContainer,
} from '../../Common'
import BorrowOrderForm from './BorrowOrderForm'
import LendOrderForm from './LendOrderForm'

const OrderFormRenderer = (props) => {

  return (
    <Container>
      <OrderWrapper>
        <BorrowOrderForm {...props} />
        <LendOrderForm {...props} />
      </OrderWrapper>

      {props.loading && <SpinnerContainer />}
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  padding: 10px;
  height: 100%;

  .spinner-container {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    cursor: not-allowed;
    background-color: rgba(31, 37, 56, .3);
  }
`

const OrderWrapper = styled.div.attrs({
  className: 'order-wrapper',
})`
  height: 100%;
`

export default OrderFormRenderer