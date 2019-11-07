// @flow
import React from 'react'
import GetStartedModalRenderer from './GetStartedModalRenderer'

import { setShowHelpModalSetting } from '../../store/services/storage'

type Props = {
  TOMOAddress: string,
  TomoBalance: number,
  WETHBalance: number,
  WETHAllowance: number,
  convertETH: number => void,
  approveWETH: void => void,
  approveTxState: Object,
  convertTxState: Object,
  redirectToTradingPage: void => void,
  isOpen: boolean,
  closeHelpModal: void => void
};

type State = {
  step: string,
  convertAmount: number,
  convertFraction: number,
  showHelpModalChecked: boolean
};

class GetStartedModal extends React.PureComponent<Props, State> {
  state = {
    step: '1',
    convertAmount: 0,
    convertFraction: 0,
    showHelpModalChecked: false,
  };

  componentWillUnmount() {
    this.handleClose()
  }

  goToFirstStep = () => {
    this.setState({ step: '1' })
  };

  goToSecondStep = () => {
    this.setState({ step: '2' })
  };

  goToThirdStep = () => {
    this.setState({ step: '3' })
  };

  changeConvertETHFraction = (convertFraction: number) => {
    this.setState((prevState, { TomoBalance }) => {
      return {
        ...prevState,
        convertFraction,
        convertAmount: (TomoBalance * convertFraction) / 100,
      }
    })
  };

  toggleShowHelpModalCheckBox = () => {
    this.setState({ showHelpModalChecked: !this.state.showHelpModalChecked })
  };

  handleClose = () => {
    const { closeHelpModal } = this.props
    const { showHelpModalChecked } = this.state

    setShowHelpModalSetting(!showHelpModalChecked)
    closeHelpModal()
  };

  handleConvertETH = () => {
    const { convertAmount } = this.state
    this.props.convertETH(convertAmount)
  };

  handleApproveWETH = () => {
    this.props.approveWETH()
  };

  checkTransactionsPending = () => {
    const { approveTxState, convertTxState } = this.props

    //the form shows pending transactions if any of the transactions is pending
    if (approveTxState.approveTxStatus === 'sent') return true
    if (convertTxState.convertTxStatus === 'sent') return true

    return false
  };

  checkTransactionsComplete = () => {
    const { approveTxState, convertTxState } = this.props
    const { approveTxStatus } = approveTxState
    const { convertTxStatus } = convertTxState

    //case where we only have an approval tx
    if (approveTxStatus === 'confirmed' && convertTxStatus === 'incomplete')
      return true

    //case where we only have an conversion tx
    if (approveTxStatus === 'incomplete' && convertTxStatus === 'confirmed')
      return true

    //case where we have both an approval and a conversion tx
    if (approveTxStatus === 'confirmed' && convertTxStatus === 'confirmed')
      return true

    //otherwise transactions are either pending or not sent yet
    return false
  };

  render() {
    const {
      step,
      convertAmount,
      convertFraction,
      showHelpModalChecked,
    } = this.state

    const {
      TOMOAddress,
      TomoBalance,
      WETHBalance,
      WETHAllowance,
      approveTxState,
      convertTxState,
      redirectToTradingPage,
      isOpen,
    } = this.props

    const userHasETH = TomoBalance > 0
    const userHasWETH = WETHBalance > 0
    const userHasApprovedWETH = WETHAllowance > 0
    const { approveTxStatus, approveTxHash } = approveTxState
    const { convertTxStatus, convertTxHash } = convertTxState

    const transactionsPending = this.checkTransactionsPending()
    const transactionsComplete = this.checkTransactionsComplete()

    return (
      <GetStartedModalRenderer
        step={step}
        goToFirstStep={this.goToFirstStep}
        goToSecondStep={this.goToSecondStep}
        goToThirdStep={this.goToThirdStep}
        changeConvertETHFraction={this.changeConvertETHFraction}
        handleClose={this.handleClose}
        handleConvertETH={this.handleConvertETH}
        handleApproveWETH={this.handleApproveWETH}
        TOMOAddress={TOMOAddress}
        TomoBalance={TomoBalance}
        WETHBalance={WETHBalance}
        convertAmount={convertAmount}
        convertFraction={convertFraction}
        userHasETH={userHasETH}
        userHasWETH={userHasWETH}
        userHasApprovedWETH={userHasApprovedWETH}
        approveTxStatus={approveTxStatus}
        approveTxHash={approveTxHash}
        convertTxStatus={convertTxStatus}
        convertTxHash={convertTxHash}
        redirectToTradingPage={redirectToTradingPage}
        toggleShowHelpModalCheckBox={this.toggleShowHelpModalCheckBox}
        showHelpModalChecked={showHelpModalChecked}
        isOpen={isOpen}
        transactionsPending={transactionsPending}
        transactionsComplete={transactionsComplete}
      />
    )
  }
}

export default GetStartedModal
