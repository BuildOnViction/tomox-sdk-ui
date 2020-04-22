// @flow
import React, { useState } from 'react'
import styled from 'styled-components'
import { Tab, Tabs } from "@blueprintjs/core"

import {
  SpinnerContainer,
} from '../../Common'
import { BorrowOrderForm, LendOrderForm } from '../OrderFormCommon'

function OrderFormRenderer(props) {
  const [selectedTabId, setselectedTabId] = useState('borrow')
  const handleTabChange = (tabId) => {
    setselectedTabId(tabId)
  }

  return (
    <Container>
      <Tabs id="order-tabs" onChange={handleTabChange} selectedTabId={selectedTabId}>
        <Tab id="borrow" title="Borrow" panel={<BorrowOrderForm {...props} />} />
        <Tab id="lend" title="Lend" panel={<LendOrderForm {...props} />} />
      </Tabs>

      {props.loading && <SpinnerContainer />}
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  padding: 0 10px;
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

  .bp3-tab {
    font-size: 12px;
  }
`

export default OrderFormRenderer