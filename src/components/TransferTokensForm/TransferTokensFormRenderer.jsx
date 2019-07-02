// @flow
import React from 'react'
import styled from 'styled-components'
import { Button, InputGroup, Label } from '@blueprintjs/core'
import TokenSelect from '../TokenSelect'
import GasSettings from '../GasSettings'
import TxNotification from '../TxNotification'
import { DarkMode, Theme } from '../Common'

type Props = {
  loading: boolean,
  status: string,
  statusMessage: string,
  gas: number,
  gasPrice: number,
  hash: string,
  receipt: Object,
  tokens: Array<Object>,
  token: Object,
  amount: number,
  receiver: string,
  handleChange: (SyntheticInputEvent<>) => void,
  handleTokenChange: (SyntheticEvent<>) => void,
  handleSubmit: (SyntheticEvent<>) => void
}

const TransferTokensFormRenderer = (props: Props) => {
  const {
    loading,
    status,
    statusMessage,
    gas,
    gasPrice,
    hash,
    receipt,
    tokens,
    token,
    amount,
    receiver,
    handleChange,
    handleTokenChange,
    handleSubmit,
  } = props

  return (
    <div>
      <Label helpertext="(in ether or in token decimals)" text="Amount to Send">
        Select a token
        <TokenSelect
          token={token}
          tokens={tokens}
          onChange={handleTokenChange}
        />
      </Label>

      <Label helpertext="(in ether or in token decimals)" text="Amount to Send"> 
        Amount         
        <InputGroupWrapper
          icon="filter"
          placeholder=""
          name="amount"
          value={amount}
          onChange={handleChange}
          autoComplete="off"
        />
      </Label>

      <Label text="Receiver Address" helpertext="(should start with 0x)">
        Receiver
        <InputGroupWrapper
          placeholder="Receiver's wallet address"
          name="receiver"
          value={receiver}
          onChange={handleChange}
        />
      </Label>

      <GasSettings gas={gas} gasPrice={gasPrice} handleChange={handleChange} />

      <TxNotificationBox>
        <TxNotification
          loading={loading}
          hash={hash}
          receipt={receipt}
          status={status}
          statusMessage={statusMessage}
          gas={gas}
        />
      </TxNotificationBox>

      <ButtonWrapper
        text="Send Transaction"
        intent="primary"
        large
        type="submit"
        fill
        onClick={handleSubmit}
        disabled={loading || (receipt !== null)}
      />
    </div>
  )
}

export default TransferTokensFormRenderer

const TxNotificationBox = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
`

const InputGroupWrapper = styled(InputGroup)`
  .bp3-input {
    height: 40px;
    color: ${DarkMode.LIGHT_GRAY};
    background: ${DarkMode.BLACK};
  }
`

const ButtonWrapper = styled(Button)`
  display: block;
  margin: 35px auto 0;
  min-width: 180px;
  text-align: center;
  color: ${DarkMode.BLACK} !important;
  border-radius: 0;
  background-color: ${DarkMode.ORANGE} !important;
  box-shadow: none !important;
  background-image: none !important;
  height: 40px;
  &:hover {
    background-color: ${DarkMode.DARK_ORANGE} !important;
  }

  &.bp3-disabled {
    cursor: default !important;
    background-color: ${DarkMode.GRAY} !important;
  }

  .bp3-button-text {
    font-size: ${Theme.FONT_SIZE_MD};
  }
`

