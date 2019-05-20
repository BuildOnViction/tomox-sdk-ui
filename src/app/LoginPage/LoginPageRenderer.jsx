import React from 'react'
// import { FormattedMessage } from 'react-intl'
import styled from 'styled-components'
import { Intent, Spinner, Tag, Label, Tab, Tabs, Button, TextArea } from '@blueprintjs/core'
// import WalletLoginForm from '../../components/WalletLoginForm'
// import CreateWalletModal from '../../components/CreateWalletModal'
// import MetamaskIcon from '../../components/Icons/Metamask'
// import { KeyIcon, WalletIcon, Trezor } from '../../components/Icons'
import { Centered, Divider, LargeText, DarkMode, Theme, SmallText } from '../../components/Common'
import type { CreateWalletParams } from '../../types/createWallet'
import { Link } from "react-router-dom"

type Props = {
  view: string,
  showWalletLoginForm: CreateWalletParams => void,
  showLoginMethods: () => void,
  loginWithMetamask: void => void,
  loginWithWallet: void => void,
  openSelectAddressModal: void => void,
  loginWithTrezorWallet: Object => void,
  loginWithLedgerWallet: void => void,
}

class LoginPageRenderer extends React.PureComponent {

  state = {
    selectedTabId: 'private-key',
  }

  handleTabChange = (selectedTabId: string) => this.setState({ selectedTabId})

  render() {
    // const {
    //   view,
    //   loginWithMetamask,
    //   loginWithWallet,
    //   openSelectAddressModal,
    //   loginWithTrezorWallet,
    //   loginWithLedgerWallet,
    //   showCreateWallet,
    //   hideModal,
    //   showWalletLoginForm,
    //   metamaskStatus,
    //   showLoginMethods,
    //   walletCreated,
    // } = this.props
    const {
      props: { handlePrivateKeyChange, unlockWalletWithPrivateKey },
      state: { selectedTabId },
    } = this

    return (
      <Wrapper>
        <ImportWalletWrapper>
          <HeaderTitle>Import your Wallet</HeaderTitle>
          <SubTitle>If you don't have a wallet go <LinkWrapper to="/create">Create new wallet</LinkWrapper></SubTitle>

          <TabsWrapper id="import-list" onChange={this.handleTabChange} selectedTabId={selectedTabId}>
            <Tab id="private-key" title="Private Key" panel={<PrivateKey handlePrivateKeyChange={handlePrivateKeyChange} unlockWalletWithPrivateKey={unlockWalletWithPrivateKey} />} />
            <Tab id="seed-phrase" title="Seed Phrase" panel={<SeedPhrase />} />
            <Tab id="ledger" title="Ledger Nano S" panel={<div></div>} />
            <Tab id="trezor" title="Trezor" panel={<div></div>} />
          </TabsWrapper>
        </ImportWalletWrapper>
      </Wrapper>
    )

    // const views = {
    //   loginMethods: (
    //     <LoginMethodsView
    //       showWalletLoginForm={showWalletLoginForm}
    //       loginWithMetamask={loginWithMetamask}
    //       openSelectAddressModal={openSelectAddressModal}
    //       loginWithTrezorWallet={loginWithTrezorWallet}
    //       loginWithLedgerWallet={loginWithLedgerWallet}
    //       showCreateWallet={showCreateWallet}
    //       metamaskStatus={metamaskStatus}
    //     />
    //   ),
    //   wallet: (
    //     <WalletLoginFormView
    //       loginWithWallet={loginWithWallet}
    //       showLoginMethods={showLoginMethods}
    //     />
    //   ),
    //   createWallet: (
    //     <CreateWalletModal
    //       walletCreated={walletCreated}
    //       hideModal={hideModal}
    //       visible={view === 'createWallet'}
    //     />
    //   ),
    //   loading: <LoginLoadingView />,
    // }

    // return views[view]
  }
}

const PrivateKey = (props) => {
  const { privateKeyStatus, handlePrivateKeyChange, unlockWalletWithPrivateKey } = props

  return (
    <React.Fragment>
      <LabelWrapper>
        <LabelTitle>Enter your private key</LabelTitle> 
        <InputGroupWrapper isInvalid={privateKeyStatus === 'invalid'} onChange={handlePrivateKeyChange} />
      </LabelWrapper>

      <LabelWrapper>
        <LabelTitle>Temporary session password</LabelTitle> 
        <InputGroupWrapper marginBottom="5px" />
      </LabelWrapper>          
      <SmallText>Password need 8 or more characters, an upper case, symbol and a number</SmallText>

      <ButtonWrapper onClick={unlockWalletWithPrivateKey}>Unlock Wallet</ButtonWrapper>
    </React.Fragment>
  )
}

const SeedPhrase = (props) => {
  return (
    <React.Fragment>
      <LabelWrapper>
        <LabelTitle>Please enter your 12 word phrase</LabelTitle> 
        <TextAreaWrapper />
      </LabelWrapper>

      <LabelWrapper>
        <LabelTitle>Temporary session password</LabelTitle> 
        <InputGroupWrapper marginBottom="5px" />
      </LabelWrapper>          
      <SmallText>Password need 8 or more characters, an upper case, symbol and a number</SmallText>

      <ButtonWrapper>Unlock Wallet</ButtonWrapper>
    </React.Fragment>
  )
}

// const LoginMethodsView = (props: Props) => {
//   const {
//     showWalletLoginForm,
//     loginWithMetamask,
//     openSelectAddressModal,
//     metamaskStatus,
//     showCreateWallet,
//   } = props
//   return (
//     <Wrapper>
//       <LoginMethods>
//         <LoginMethodsHeading>
//           <FormattedMessage
//             id="loginPage.loginMethods"
//             defaultMessage="Please choose login methods"
//           />
//         </LoginMethodsHeading>
//         <LoginCards>
//           <LoginCard onClick={loginWithMetamask}>
//             <MetamaskIcon size={100} />
//             <Heading>
//               <FormattedMessage
//                 id="loginPage.metamask"
//                 defaultMessage="Metamask"
//               />
//             </Heading>
//             <MetamaskStatusTag>
//               {metamaskStatuses[metamaskStatus]}
//             </MetamaskStatusTag>
//           </LoginCard>
//           <LoginCard onClick={openSelectAddressModal}>
//             <Trezor size={100} />
//             <Heading>
//               <FormattedMessage
//                 id="loginPage.trezorWallet"
//                 defaultMessage="Trezor Wallet"
//               />
//             </Heading>
//             <HardwareWalletStatusTag>
//               {recommendedStatus}
//             </HardwareWalletStatusTag>
//           </LoginCard>
//           <LoginCard onClick={showWalletLoginForm}>
//             <KeyIcon size={100} />
//             <Heading>
//               <FormattedMessage id="loginPage.wallet" defaultMessage="Wallet" />
//             </Heading>
//           </LoginCard>
//           <LoginCard onClick={showCreateWallet}>
//             <WalletIcon size={100} color={Colors.WHITE} />
//             <Heading>
//               <FormattedMessage
//                 id="loginPage.createWallet"
//                 defaultMessage="Create Wallet"
//               />
//             </Heading>
//           </LoginCard>
//         </LoginCards>
//       </LoginMethods>
//     </Wrapper>
//   )
// }

// const WalletLoginFormView = (props: Props) => {
//   const { loginWithWallet, showLoginMethods } = props
//   return (
//     <WalletLoginViewWrapper>
//       <WalletLoginForm
//         loginWithWallet={loginWithWallet}
//         showLoginMethods={showLoginMethods}
//       />
//     </WalletLoginViewWrapper>
//   )
// }

const LoginLoadingView = (props: Props) => {
  return (
    <Centered>
      <Spinner large intent="primary" />
      <Divider />
      <LargeText intent="primary">Logging In ...</LargeText>
    </Centered>
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
  }

  .bp3-tab-panel {
    padding: 45px 25px 30px;
  }
`

const TextAreaWrapper = styled(TextArea)`
  width: 100%;
  height: 128px !important;
  background-color: ${DarkMode.BLACK};
  margin-bottom: 30px;
  resize: none;
  font-size: ${Theme.FONT_SIZE_LG};
  color: ${DarkMode.WHITE};

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
`

const LabelTitle = styled.div`
  margin-bottom: 25px;
`

const ButtonWrapper = styled(Button)`
  display: block;
  margin-top: 45px;
  width: 100%;
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
`

const InputGroupWrapper = styled.input`
  height: 50px;
  color: ${DarkMode.WHITE};
  font-size: ${Theme.FONT_SIZE_LG};
  padding: 15px;
  margin-top: 0 !important;
  margin-bottom: ${props => props.marginBottom ? props.marginBottom : '35px'};
  background: ${DarkMode.BLACK};
  border: ${props => props.isInvalid ? '1px solid red' : 'none'};
  width: 100%;

  &:focus {
    border: ${props => props.isInvalid ? `1px solid ${DarkMode.RED}` : `1px solid ${DarkMode.ORANGE}`};
  }
`

// const WalletLoginViewWrapper = styled.div`
//   margin-top: 5em;
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
// `

// const Announcement = styled.section``

// const Heading = styled.h4`
//   margin-top: 10px;
//   margin-bottom: 10px;
// `

// const Reminder = styled.div``

// const LoginMethods = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
// `

// const LoginMethodsHeading = styled.h3`
//   display: flex;
//   justify-content: center;
//   padding-top: 60px;
// `

// const LoginCards = styled.div`
//   padding-top: 20px;
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
// `

// const AnnouncementMessages = styled.div`
//   padding-top: 10px;
//   padding-bottom: 10px;
// `

// const LoginCard = styled(Card).attrs({
//   interactive: true,
// })`
//   margin: 10px;
//   height: 13em;
//   width: 13em;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
// `

// const MetamaskStatusTag = styled(Tag).attrs({
//   intent: Intent.SUCCESS,
//   interactive: true,
//   minimal: true,
//   textalign: 'center',
// })``

// const HardwareWalletStatusTag = styled(Tag).attrs({
//   intent: Intent.SUCCESS,
//   interactive: true,
//   minimal: true,
//   textalign: 'center',
// })``

// const metamaskStatuses = {
//   undefined: 'Not found',
//   locked: 'Locked',
//   unlocked: 'Connected',
// }

// const recommendedStatus = 'Recommended'
