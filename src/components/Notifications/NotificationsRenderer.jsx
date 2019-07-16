// @flow
import React from 'react'
import styled from 'styled-components'
import { Icon } from '@blueprintjs/core'
import { formatDistanceStrict } from 'date-fns'
import { Theme, DarkMode } from '../../components/Common'

const NotificationsRenderer = ({ notifications }) => {

    return (
        <React.Fragment>
            <NotificationTitle>Notification</NotificationTitle>
            <NotificationList>
                {
                    notifications.map((notification, index) => {
                        return (
                            <Notification key={index}>
                                <div>{notification.message}</div>
                                <NotificationDate>
                                    <Icon icon="time" iconSize="12" />
                                    <DistanceDate>{formatDistanceStrict(new Date(notification.updatedAt), new Date())}</DistanceDate>
                                </NotificationDate>
                            </Notification>
                        )            
                    })
                }
            </NotificationList>
        </React.Fragment>
    )
}

export default NotificationsRenderer

const NotificationList = styled.div`
  height: 430px;
  width: 300px;
  overflow-x: hidden;
  color: ${props => props.theme.menuColor};
  background-color: ${props => props.theme.menuBg};
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, .5);
`

const NotificationTitle = styled.div`
  text-align: center;
  height: 35px;
  line-height: 35px;
  color: ${props => props.theme.menuColor};
  border-bottom: 1px solid ${props => props.theme.menuBorder};
  background-color: ${props => props.theme.menuBg};
`

const Notification = styled.div`
  font-size: ${Theme.FONT_SIZE_SM};
  word-break: break-all;
  padding: 5px 15px;
  border-bottom: 1px solid ${props => props.theme.menuBorder};
  &:hover {
    background-color: ${props => props.theme.menuBgHover};
  }
`

const NotificationDate = styled.div`
  display: flex;
  align-items: center;
  color: ${DarkMode.GRAY};
  margin-top: 5px;
`

const DistanceDate = styled.span`
  margin-left: 5px;
`
