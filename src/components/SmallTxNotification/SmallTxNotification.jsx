// @flow
import React from 'react';
import { Callout, Button, Intent, Spinner } from '@blueprintjs/core';
import { Indent } from '../Common';
import styled from 'styled-components';

type Props = {
  loading: boolean,
  status: string,
  txName: string,
  hash: string
};

//TODO Add link to TOMOscan
const SmallTxNotification = (props: Props) => {
  const { status, hash, txName } = props;
  console.log(hash);
  switch (status) {
    case 'incomplete':
      return null;
    case 'sent':
      return (
        <CalloutBox>
          <Callout intent={Intent.SUCCESS} icon={null}>
            <NotificationBox>
              <div>
                <Spinner size={25} intent={Intent.SUCCESS} />
                <Indent /> {txName} pending
              </div>
              <Button minimal disabled>
                View on TOMOscan
              </Button>
            </NotificationBox>
          </Callout>
        </CalloutBox>
      );
    case 'confirmed':
      return (
        <CalloutBox>
          <Callout intent={Intent.SUCCESS} icon="tick">
            <NotificationBox>
              {txName} successful
              <Button minimal disabled>
                View on TOMOscan
              </Button>
            </NotificationBox>
          </Callout>
        </CalloutBox>
      );
    case 'reverted':
      return (
        <CalloutBox>
          <Callout intent={Intent.DANGER} icon="cross">
            <NotificationBox>
              {txName} error
              <Button minimal disabled>
                View on TOMOscan
              </Button>
            </NotificationBox>
          </Callout>
        </CalloutBox>
      );
    case 'error':
      return (
        <CalloutBox>
          <Callout intent={Intent.DANGER} icon="warning-sign">
            {txName}
          </Callout>
        </CalloutBox>
      );
    default:
      return null;
  }
};

const CalloutBox = styled.div`
  width: 500px;
`;

const NotificationBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

export default SmallTxNotification;
