// @flow
import React from 'react'
import styled from 'styled-components'
import { Icon, Spinner, Intent } from '@blueprintjs/core'
import { formatDistanceStrict } from 'date-fns'
import { enUS, tr, vi, fr, nl  } from 'date-fns/locale'
import { injectIntl, FormattedMessage } from 'react-intl'
import { TOMOSCAN_URL } from '../../config/environment'
import { Theme, TmColors } from '../../components/Common'

const LANGUAGES = {
  en: enUS,
  tr,
  vi,
  fr,
  nl,
}

const MESSAGES = {
  'ORDER_ADDED': <FormattedMessage id='notifications.orderAdded' />,
  'ORDER_CANCELLED': <FormattedMessage id='notifications.orderCancelled' />,
  'ORDER_REJECTED': <FormattedMessage id='notifications.orderRejected' />,
  'ORDER_MATCHED': <FormattedMessage id='notifications.orderMatched' />,
  'ORDER_SUCCESS': <FormattedMessage id='notifications.orderSuccess' />,  
  'ORDER_PENDING': <FormattedMessage id='notifications.orderPending' />,

  'LENDING_ORDER_ADDED': <FormattedMessage id='notifications.lendingOrderAdded' />,
  'LENDING_ORDER_CANCELLED': <FormattedMessage id='notifications.lendingOrderCancelled' />,
  'LENDING_ORDER_REJECTED': <FormattedMessage id='notifications.lendingOrderRejected' />,
  'LENDING_ORDER_MATCHED': <FormattedMessage id='notifications.lendingOrderMatched' />,
  'LENDING_ORDER_SUCCESS': <FormattedMessage id='notifications.lendingOrderSuccess' />,  
  'LENDING_ORDER_PENDING': <FormattedMessage id='notifications.lendingOrderPending' />,
  'LENDING_ORDER_REPAYED': <FormattedMessage id='notifications.lendingOrderRepayed' />,
  'LENDING_ORDER_TOPUPED': <FormattedMessage id='notifications.lendingOrderTopUped' />,

  'ERROR': <FormattedMessage id='notifications.orderError' />,
}

const generateScanUrl = (type, txHash) => {
  switch(type) {
    case 'ORDER_ADDED': 
    case 'ORDER_CANCELLED': 
    case 'ORDER_PENDING':
    case 'ORDER_REJECTED':
      return `${TOMOSCAN_URL}/orders/${txHash}`
    case 'ORDER_MATCHED':
    case 'ORDER_SUCCESS':
      return `${TOMOSCAN_URL}/trades/${txHash}`

    case 'LENDING_ORDER_ADDED': 
    case 'LENDING_ORDER_CANCELLED': 
    case 'LENDING_ORDER_PENDING':
    case 'LENDING_ORDER_REJECTED':
      return `${TOMOSCAN_URL}/lending/orders/${txHash}`
    case 'LENDING_ORDER_MATCHED':
    case 'LENDING_ORDER_SUCCESS':
    case 'LENDING_ORDER_REPAYED':
    case 'LENDING_ORDER_TOPUPED':
      return `${TOMOSCAN_URL}/lending/trades/${txHash}`

    default:
      return ''
  }
}

class NotificationsRenderer extends React.PureComponent {
  onScroll = (event) => {
    const { scrollHeight, scrollTop, clientHeight } = event.target
    const { loading, getNotifications } = this.props

    if ((scrollHeight - scrollTop) === clientHeight && !loading) {
      getNotifications()
    }
  }
  
  render() {
    const { 
      intl,
      address,
      loading,
      notifications, 
      markAllNotificationsRead,
      markNotificationRead,
      markNotificationUnRead,
    } = this.props

    return (
      <Wrapper>
        <NotificationTitle>
          <FormattedMessage id="notifications.title" />
          <MarkReadAll onClick={() => markAllNotificationsRead(address)}><FormattedMessage id="notifications.markAllAsRead" /></MarkReadAll>
        </NotificationTitle>
        <NotificationList onScroll={this.onScroll}>
          { !notifications.length && !loading && <NoItems><FormattedMessage id="notifications.noNotifications" /></NoItems> }
          {
            (notifications.length > 0) && notifications.map((notification, index) => {
              return (
                <Notification unread={notification.status === 'UNREAD'} key={index}>
                  <div>{MESSAGES[notification.message.type]}</div>
                  <NotificationDate>
                      <Icon icon="time" iconSize="12" />
                      <DistanceDate>{formatDistanceStrict(new Date(notification.createdAt), new Date(), {locale: LANGUAGES[intl.locale]})}</DistanceDate>
                  </NotificationDate>
                  <IconsBox>
                    <TomoScanLink target="_blank" href={generateScanUrl(notification.message.type, notification.message.description)}>
                      <Icon htmlTitle={intl.formatMessage({ id: "notifications.tomoScan" })} icon="document-share" iconSize="15" />
                    </TomoScanLink>
                    {(notification.status === 'UNREAD') && (<MarkRead htmlTitle={intl.formatMessage({id: "notifications.markAsRead"})} onClick={() => markNotificationRead(notification.id)} icon="eye-open" iconSize="15" />)}
                    {(notification.status !== 'UNREAD') && (<MarkRead htmlTitle={intl.formatMessage({id: "notifications.markAsUnread"})} onClick={() => markNotificationUnRead(notification.id)} icon="eye-on" iconSize="15" />)}
                  </IconsBox>
                </Notification>
              )            
            })
          }
        </NotificationList>
        { loading  && <Loading><Spinner size={30} intent={Intent.PRIMARY} /></Loading> }
      </Wrapper>
    )
  }
}

export default injectIntl(NotificationsRenderer)

const Wrapper = styled.div`
  border: 1px solid ${props => props.theme.border};
  box-shadow: 0 5px 5px 0 rgba(0, 0, 0, .1);
`

const NotificationList = styled.div`
  position: relative;
  height: 430px;
  width: 300px;
  overflow-x: hidden;
  color: ${props => props.theme.menuColor};
  background: ${props => props.theme.notificationBg};
`

const NotificationTitle = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 15px;
  height: 35px;
  line-height: 35px;
  color: ${props => props.theme.menuColor};
  border-bottom: 1px solid ${props => props.theme.menuBorder};
  background-color: ${props => props.theme.menuBg};
`

const Notification = styled.div`
  position: relative;
  font-size: ${Theme.FONT_SIZE_SM};
  word-break: break-all;
  padding: 5px 15px;
  border-bottom: 1px solid ${props => props.theme.menuBorder};
  background-color: ${props => props.unread ? props.theme.subBg : 'inherit'};
  &:hover {
    background-color: ${props => props.theme.menuBgHover};
    .notification-status {
      display: block;
    }
  }
`

const MarkReadAll = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

const IconsBox = styled.div.attrs({
  className: 'notification-status',
})`
  display: none;
  cursor: pointer;
  position: absolute;
  top: 50%;
  right: 25px;
  transform: translateY(-50%);
`

const MarkRead = styled(Icon)``

const NotificationDate = styled.div`
  display: flex;
  align-items: center;
  color: ${TmColors.GRAY};
  margin-top: 5px;
`

const DistanceDate = styled.span`
  margin-left: 5px;
`

const NoItems = styled.div`
  text-align: center;
  margin-top: 50px;
`

const Loading = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px 0;
  text-align: center;
`

const TomoScanLink = styled.a`
  display: inline-block;
  margin-right: 10px;
  color: ${props => props.theme.menuColor};

  &:hover {
    color: ${props => props.theme.menuColor};
  }
`
