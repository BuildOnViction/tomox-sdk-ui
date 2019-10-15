// @flow
import React from 'react'
import styled from 'styled-components'
import { Button, InputGroup, Label } from '@blueprintjs/core'
import { injectIntl, FormattedMessage } from 'react-intl'
import TokenSelect from '../TokenSelect'
import GasSettings from '../GasSettings'
import TxNotification from '../TxNotification'
import { TmColors, Theme } from '../Common'

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
    intl,
  } = props

  return (
    <div>
      <Label helpertext="(in ether or in token decimals)" text="Amount to Send">
        <FormattedMessage id="portfolioPage.transferTokensModal.select" />
        <TokenSelect
          token={token}
          tokens={tokens}
          onChange={handleTokenChange}
        />
      </Label>

      <Label helpertext="(in ether or in token decimals)" text="Amount to Send"> 
        <FormattedMessage id="portfolioPage.transferTokensModal.amount" />         
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
        <FormattedMessage id="portfolioPage.transferTokensModal.receiver" />
        <InputGroupWrapper
          placeholder={intl.formatMessage({id: "portfolioPage.transferTokensModal.receiverPlaceholder"})}
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
        text={<FormattedMessage id="portfolioPage.transferTokensModal.btnTitle" />}
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

export default injectIntl(TransferTokensFormRenderer)

const TxNotificationBox = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
`

const InputGroupWrapper = styled(InputGroup)`
  .bp3-input {
    height: 40px;
    color: ${TmColors.LIGHT_GRAY};
    background: ${TmColors.BLACK};
  }
`

const ButtonWrapper = styled(Button)`
  display: block;
  margin: 35px auto 0;
  min-width: 180px;
  text-align: center;
  color: ${TmColors.BLACK} !important;
  border-radius: 0;
  background-color: ${TmColors.ORANGE} !important;
  box-shadow: none !important;
  background-image: none !important;
  height: 40px;
  &:hover {
    background-color: ${TmColors.DARK_ORANGE} !important;
  }

  &.bp3-disabled {
    cursor: default !important;
    background-color: ${TmColors.GRAY} !important;
  }

  .bp3-button-text {
    font-size: ${Theme.FONT_SIZE_MD};
  }
`

