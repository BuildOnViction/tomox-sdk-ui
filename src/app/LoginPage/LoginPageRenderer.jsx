import React from 'react'
import styled from 'styled-components'
import { Label, Tab, Tabs, Button, Dialog, MenuItem, Spinner } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'
import { FormattedMessage } from 'react-intl'

import { DarkMode, Theme, SmallText } from '../../components/Common'
// import type { CreateWalletParams } from '../../types/createWallet'
import { Link } from "react-router-dom"
import SelectAddressModal from '../../components/SelectAddressModal'
import appTomoLogoUrl from '../../assets/images/app_tomo_logo.svg'

type Props = {
  selectedTabId: string,
  handleTabChange: void => void,
  privateKeyStatus: string,
  privateKey: string,
  mnemonicStatus: string,
  mnemonic: string,
  handlePrivateKeyChange: void => void, 
  unlockWalletWithPrivateKey: void => void,
  handleMnemonicChange: void => void,
  unlockWalletWithMnemonic: void => void,
  password: string,
  handlePasswordChange: void => void,
}

class LoginPageRenderer extends React.PureComponent<Props> {

  render() {
    const {
      selectedTabId,
      handleTabChange,
      privateKeyStatus,
      privateKey,
      mnemonicStatus,
      mnemonic,
      handlePrivateKeyChange, 
      unlockWalletWithPrivateKey,
      handleMnemonicChange,
      unlockWalletWithMnemonic,
      password,
      passwordStatus,
      handlePasswordChange,
      addresses,
      isOpenAddressesDialog,
      toggleAddressesDialog,
      loginWithLedgerWallet,
      handleHdPathChange,
      indexHdPathActive,
      hdPaths,
      connectToLedger,
      nextAddresses,
      prevAddresses,
      ledgerError,
      errorList,
      openAddressesTrezorDialog,
      isSelectAddressModalOpen,
      closeAddressesTrezorDialog,
      deviceService,
      loading,
    } = this.props

    return (
      <Wrapper>
        <ImportWalletWrapper>
          <HeaderTitle><FormattedMessage id="unlockWalletPage.title" /></HeaderTitle>
          <SubTitle><FormattedMessage id="unlockWalletPage.subTitlePart1" /> <LinkWrapper to="/create"><FormattedMessage id="unlockWalletPage.subTitlePart2" /></LinkWrapper></SubTitle>

          <TabsWrapper id="import-list" onChange={handleTabChange} selectedTabId={selectedTabId}>
            <Tab 
              id="private-key" 
              title="Private Key" 
              panel={
                <PrivateKey 
                  privateKey={privateKey} 
                  privateKeyStatus={privateKeyStatus} 
                  handlePrivateKeyChange={handlePrivateKeyChange} 
                  unlockWalletWithPrivateKey={unlockWalletWithPrivateKey}
                  password={password}
                  passwordStatus={passwordStatus}
                  handlePasswordChange={handlePasswordChange} />
              } />

            <Tab 
              id="seed-phrase" 
              title="Mnemonic Phrase" 
              panel={
                <MnemonicPhrase 
                  mnemonic={mnemonic} 
                  mnemonicStatus={mnemonicStatus} 
                  handleMnemonicChange={handleMnemonicChange} 
                  unlockWalletWithMnemonic={unlockWalletWithMnemonic}
                  password={password}
                  passwordStatus={passwordStatus}
                  handlePasswordChange={handlePasswordChange} />
              } />

            <Tab id="ledger" title="Ledger Nano S" panel={
              <LedgerDevice 
                addresses={addresses}
                isOpenAddressesDialog={isOpenAddressesDialog}
                toggleAddressesDialog={toggleAddressesDialog}
                loginWithLedgerWallet={loginWithLedgerWallet}
                handleHdPathChange={handleHdPathChange}
                indexHdPathActive={indexHdPathActive}
                hdPaths={hdPaths}
                connectToLedger={connectToLedger}
                nextAddresses={nextAddresses}
                prevAddresses={prevAddresses}
                ledgerError={ledgerError}
                errorList={errorList}
                loading={loading} />
            } />

            <Tab id="trezor" title="Trezor" panel={
              <TrezorDevice 
                openAddressesTrezorDialog={openAddressesTrezorDialog}
                closeAddressesTrezorDialog={closeAddressesTrezorDialog}
                isSelectAddressModalOpen={isSelectAddressModalOpen}
                deviceService={deviceService} />
            } />
          </TabsWrapper>
        </ImportWalletWrapper>
      </Wrapper>
    )
  }
}

const PrivateKey = (props) => {
  const { 
    privateKey, 
    privateKeyStatus, 
    handlePrivateKeyChange, 
    unlockWalletWithPrivateKey,
    password,
    passwordStatus,
    handlePasswordChange,
  } = props

  return (
    <React.Fragment>
      <LabelWrapper>
        <LabelTitle><FormattedMessage id="unlockWalletPage.privateKey.labelPrivateKey" /></LabelTitle> 
        <InputGroupWrapper marginBottom="5px" type="text" value={privateKey} isInvalid={privateKeyStatus === 'invalid'} onChange={handlePrivateKeyChange} />
      </LabelWrapper>
      {(privateKeyStatus === 'invalid') && (<ErrorMessage><FormattedMessage id="unlockWalletPage.privateKey.invalid" /></ErrorMessage>)}

      <LabelWrapper>
        <LabelTitle><FormattedMessage id="unlockWalletPage.labelPassword" /></LabelTitle> 
        <InputGroupWrapper type="password" value={password} onChange={handlePasswordChange} isInvalid={passwordStatus === 'invalid'} marginBottom="5px" />
      </LabelWrapper>          
      <SmallText><FormattedMessage id="unlockWalletPage.describePassword" /></SmallText>

      <ButtonWrapper onClick={unlockWalletWithPrivateKey} disabled={passwordStatus !== 'valid' || privateKeyStatus !== 'valid'}><FormattedMessage id="unlockWalletPage.unlockWallet" /></ButtonWrapper>
    </React.Fragment>
  )
}

const MnemonicPhrase = (props) => {
  const { 
    mnemonic,
    mnemonicStatus, 
    handleMnemonicChange, 
    unlockWalletWithMnemonic,
    password, 
    passwordStatus,
    handlePasswordChange,
  } = props

  return (
    <React.Fragment>
      <LabelWrapper>
        <LabelTitle><FormattedMessage id="unlockWalletPage.mnemonic.labelMnemonic" /></LabelTitle> 
        <TextAreaWrapper value={mnemonic} isInvalid={mnemonicStatus === 'invalid'} onChange={handleMnemonicChange} />
      </LabelWrapper>
      {(mnemonicStatus === 'invalid') && (<ErrorMessage><FormattedMessage id="unlockWalletPage.mnemonic.invalid" /></ErrorMessage>)}

      <LabelWrapper>
        <LabelTitle><FormattedMessage id="unlockWalletPage.labelPassword" /></LabelTitle> 
        <InputGroupWrapper type="password" value={password} onChange={handlePasswordChange} isInvalid={passwordStatus === 'invalid'} marginBottom="5px" />
      </LabelWrapper>          
      <SmallText><FormattedMessage id="unlockWalletPage.describePassword" /></SmallText>

      <ButtonWrapper disabled={passwordStatus !== 'valid' || mnemonicStatus !== 'valid'} onClick={unlockWalletWithMnemonic}>Unlock Wallet</ButtonWrapper>
    </React.Fragment>
  )
}

const LedgerDevice = (props) => {
  const { 
    addresses, 
    isOpenAddressesDialog,
    toggleAddressesDialog,
    loginWithLedgerWallet,
    handleHdPathChange,
    indexHdPathActive,
    hdPaths,
    connectToLedger,
    prevAddresses,
    nextAddresses,
    ledgerError,
    errorList,
    loading,
  } = props

  return (
    <LedgerWrapper>
      <Title><FormattedMessage id="unlockWalletPage.ledger.instruction1" /></Title>

      <LedgerImageBox>       
        <LedgerImageBody>
          <LedgerScreen>
            <PasswordSymbol>******</PasswordSymbol>            
          </LedgerScreen>
          <LedgerCircle />
        </LedgerImageBody>

        <LedgerImageHead />
      </LedgerImageBox>

      <Title><FormattedMessage id="unlockWalletPage.ledger.instruction2" /></Title>

      <LedgerImageBox>       
        <LedgerImageBody>
          <LedgerScreen>
            <img src={appTomoLogoUrl} alt="app Tomo logo"/>          
          </LedgerScreen>
          <LedgerCircle />
        </LedgerImageBody>

        <LedgerImageHead />
      </LedgerImageBox>

      {ledgerError && <ErrorMessage>{errorList[ledgerError.statusCode || ledgerError.name]}</ErrorMessage>}
      <InstructionBox>
        <Title color={DarkMode.ORANGE} cursor="pointer"><FormattedMessage id="unlockWalletPage.connectionIssues" /></Title>
        <Title color={DarkMode.ORANGE} cursor="pointer"><FormattedMessage id="unlockWalletPage.instructions" /></Title>
      </InstructionBox>

      <ButtonWrapper onClick={connectToLedger}><FormattedMessage id="unlockWalletPage.ledger.buttonTitle" /> {loading && <Spinner intent="PRIMARY" size={Spinner.SIZE_SMALL} />}</ButtonWrapper>

      <AddressesDialog 
        addresses={addresses}
        isOpenAddressesDialog={isOpenAddressesDialog}
        onClose={toggleAddressesDialog}
        loginWithLedgerWallet={loginWithLedgerWallet}
        prevAddresses={prevAddresses}
        nextAddresses={nextAddresses}
        handleHdPathChange={handleHdPathChange}
        hdPaths={hdPaths}
        indexHdPathActive={indexHdPathActive}
        ledgerError={ledgerError}
        errorList={errorList} />
    </LedgerWrapper>
  )
}

const TrezorDevice = (props) => {
  const { 
    isSelectAddressModalOpen, 
    openAddressesTrezorDialog, 
    closeAddressesTrezorDialog,
    deviceService,
  } = props

  return (
    <LedgerWrapper>
      <Title>1. Enter PIN Code</Title>

      <LedgerImageBox>       
        <LedgerImageBody>
          <LedgerScreen>
            <PasswordSymbol>******</PasswordSymbol>            
          </LedgerScreen>
          <LedgerCircle />
        </LedgerImageBody>

        <LedgerImageHead />
      </LedgerImageBox>

      <Title>2. Open TomoChain</Title>

      <LedgerImageBox>       
        <LedgerImageBody>
          <LedgerScreen>
            <img src={appTomoLogoUrl} alt="app Tomo logo"/>          
          </LedgerScreen>
          <LedgerCircle />
        </LedgerImageBody>

        <LedgerImageHead />
      </LedgerImageBox>

      <InstructionBox>
        <Title color={DarkMode.ORANGE} cursor="pointer"><FormattedMessage id="unlockWalletPage.connectionIssues" /></Title>
        <Title color={DarkMode.ORANGE} cursor="pointer"><FormattedMessage id="unlockWalletPage.instructions" /></Title>
      </InstructionBox>

      <ButtonWrapper onClick={ openAddressesTrezorDialog }><FormattedMessage id="unlockWalletPage.trezor.buttonTitle" /></ButtonWrapper>

      <SelectAddressModal
        title="Trezor Address"
        isOpen={isSelectAddressModalOpen}
        handleClose={closeAddressesTrezorDialog}
        deviceService={deviceService}
      />
    </LedgerWrapper>
  )
}

class AddressesDialog extends React.PureComponent {

  render() {
    const { 
      addresses, 
      loginWithLedgerWallet, 
      isOpenAddressesDialog, 
      onClose,
      nextAddresses,
      prevAddresses,
      handleHdPathChange,
      hdPaths,
      indexHdPathActive,
      ledgerError,
      errorList,
    } = this.props

    return (
      <Dialog
        className="dark-dialog"
        onClose={onClose}
        title="Ledger Address"
        canOutsideClickClose={false}
        isOpen={isOpenAddressesDialog}>

        <div>Select HD derivation path:</div>

        <SelectHdPathBox>
          <SelectHdPath
            items={hdPaths}
            itemRenderer={renderHdPath}
            popoverProps={{ minimal: true, popoverClassName: 'hd-path-tooltip', portalClassName: 'hd-path-tooltip-wrapper' }}
            noResults={<MenuItem disabled text="No results." />}
            filterable={false}
            onActiveItemChange={handleHdPathChange}>
              <Button text={`${hdPaths[indexHdPathActive].rank}. ${hdPaths[indexHdPathActive].path} - ${hdPaths[indexHdPathActive].type}`} rightIcon="caret-down" />
          </SelectHdPath>
          {ledgerError && <ErrorMessage>{errorList[ledgerError.statusCode || ledgerError.name]}</ErrorMessage>}
        </SelectHdPathBox>

        {(addresses.length > 0) && (
          <AddressWrapper>
            <div>Select an address to use:</div>
            <AddressListBox addresses={addresses} loginWithLedgerWallet={loginWithLedgerWallet} />
          </AddressWrapper>
        )}

        {(addresses.length > 0) && (
          <NavigatorBox>
            <NavigatorItem onClick={prevAddresses}>&lt; Previous</NavigatorItem> 
            <NavigatorItem onClick={nextAddresses}>Next &gt;</NavigatorItem>
          </NavigatorBox> 
        )}      
      </Dialog>
    )
  }
}

const AddressListBox = (props) => {
  const { addresses, loginWithLedgerWallet } = props

  const addressItems = addresses.map((address) => {
    return (
      <AddressItem key={ address.index }
        onClick={() => loginWithLedgerWallet(address)}>
        <div>{address.index + 1}. {address.addressString}</div>
        <div>{address.balance}</div>
      </AddressItem>
    )
  })

  return (
    <AddressList>
      { addressItems }
    </AddressList>
  )
}

const renderHdPath = (hdPath, { handleClick, modifiers, query }) => {
  const text = `${hdPath.rank}. ${hdPath.path} - ${hdPath.type}`

  return (
      <MenuItem
          active={modifiers.active}
          disabled={modifiers.disabled}
          key={hdPath.rank}
          onClick={handleClick}
          text={text}
          className="hd-path-item"
      />
  )
}

export default LoginPageRenderer

const Wrapper = styled.div``

const TabsWrapper = styled(Tabs)`
  margin-top: 35px;

  .bp3-tab-list {
    justify-content: space-between;

    .bp3-tab {
      margin: 0;

      &:last-child {
        text-align: right;
      }
    }

    .bp3-tab-indicator-wrapper {
      display: block;

      .bp3-tab-indicator {
        height: 2px;
        background-color: ${DarkMode.ORANGE};
      }
    }

    .bp3-tab {
      color: ${DarkMode.LIGHT_GRAY};
    }

    .bp3-tab[aria-selected="true"],
    .bp3-tab:hover {
      color: ${DarkMode.WHITE};
    }
  }

  .bp3-tab-panel {
    padding: 45px 25px 30px;
  }
`

const TextAreaWrapper = styled.textarea`
  width: 100%;
  min-height: 128px !important;
  padding: 15px;
  background-color: ${DarkMode.BLACK};
  margin-bottom: 5px;
  resize: none;
  font-size: ${Theme.FONT_SIZE_LG};
  color: ${DarkMode.WHITE};
  border: ${props => props.isInvalid ? `1px solid ${DarkMode.RED} !important` : 'none'};

  &:focus {
    border: 1px solid ${DarkMode.ORANGE};
  }
`

const ImportWalletWrapper = styled.div`
  width: 395px;
  margin: 50px auto 0;
`

const HeaderTitle = styled.h1`
  color: ${DarkMode.WHITE};
  font-size: 24px;
  font-weight: 300;
  text-align: center;
  line-height: 24px;
`

const LinkWrapper = styled(Link)`
  color: ${DarkMode.ORANGE};

  &:hover {
    color: ${DarkMode.DARK_ORANGE};
  }
`

const SubTitle = styled.div`
  text-align: center;
`

const LabelWrapper = styled(Label)`
  margin-bottom: 0 !important;
  &:not(:first-child) {
    margin-top: 35px;
  }
`

const LabelTitle = styled.div`
  margin-bottom: 25px;
`

const ButtonWrapper = styled(Button)`
  display: block;
  margin-top: ${props => props.margintop ? props.margintop : '45px'};
  margin-left: auto;
  margin-right: auto;
  width: ${props => props.width ? props.width : '100%'};
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

  .bp3-spinner {
    display: inline-block;
    margin-left: 5px;
  }
`

const InputGroupWrapper = styled.input`
  height: 50px;
  color: ${DarkMode.WHITE};
  font-size: ${Theme.FONT_SIZE_LG};
  padding: 15px;
  margin-top: 0 !important;
  margin-bottom: ${props => props.marginBottom ? props.marginBottom : '35px'};
  background: ${DarkMode.BLACK};
  border: ${props => props.isInvalid ? `1px solid ${DarkMode.RED} !important` : 'none'};
  width: 100%;import { loginWithTrezorWallet } from '../../store/models/loginPage';


  &:focus {
    border: 1px solid ${DarkMode.ORANGE};
  }
`

const ErrorMessage = styled.div`
  color: ${DarkMode.RED};
  font-size: 12px;
  margin-top: 7px;
`

const LedgerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.div`
  text-align: ${props => props.textAlign ? props.textAlign : 'left'};
  color: ${props => props.color ? props.color : 'inherit'}
  cursor: ${props => props.cursor ? props.cursor : 'initial'};
`

const LedgerImageBox = styled.div`
  position: relative;
  padding-left: 16px;
  width: 162px;
  margin-top: 20px;
  margin-bottom: 40px;
`

const LedgerImageBody = styled.div`
  width: 146px;
  height: 41px;
  border-radius: 6px;
  background-color: ${DarkMode.BLACK};
`

const LedgerImageHead = styled.div`
  width: 16px;
  height: 18px;
  background-color: ${DarkMode.LIGHT_BLUE};
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);

  &::before,
  &::after {
    content: " ";
    width: 9px;
    height: 3px;
    display: inline-block;
    background-color: ${DarkMode.BLACK};
    position: absolute;
    left: 4px;
    top: 4px;
  }

  &::after {
    top: 11px;
  }
`

const LedgerScreen = styled.div`
  width: 85px;
  height: 18px;
  text-align: center;
  background-color: ${DarkMode.LIGHT_BLUE};
  position: absolute;
  left: 35px;
  top: 50%;
  transform: translateY(-50%);
`

const LedgerCircle = styled.div`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: ${DarkMode.LIGHT_BLUE};
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 12px;
`

const PasswordSymbol = styled.span`
  display: inline-block;
  padding-top: 3px;
  color: ${DarkMode.ORANGE};
`

const InstructionBox = styled.div`
  width: 100%;  
  display: flex;
  justify-content: space-between;
  margin-top: 13px;
`

const AddressWrapper = styled.div``

const AddressList = styled.ul`
  height: 175px;
  overflow-x: hidden;
  overflow-y: auto;
  margin-top: 10px;
`

const AddressItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 8px;
  cursor: pointer;

  &:nth-child(2n+1) {
    background-color: ${DarkMode.BLACK};
  }

  &:hover {
    background-color: ${DarkMode.BLUE};
  }
`

const SelectHdPathBox = styled.div`
  margin: 12px 0 30px;
`

const SelectHdPath = styled(Select)`
  .bp3-popover-target {
    width: 100%;
  }

  .bp3-button {
    height: 40px;
    width: 100%;
    border-radius: 0;
  }
`

const NavigatorBox = styled.div`
  display: flex;
  justify-content: center;
`

const NavigatorItem = styled.span`
  margin: 0 10px;
  user-select: none;
  cursor: pointer;

  &:hover {
    color: ${DarkMode.ORANGE};
  }
`

