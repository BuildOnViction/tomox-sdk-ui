// @flow
import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { injectIntl, FormattedMessage } from "react-intl"
import CenteredSpinner from '../../components/Common/CenteredSpinner'
import MarketsTable from '../../components/MarketsTable'
import LineChart from '../../components/LineChart/LineChart'
import { SmallText, TmColors, Theme } from '../../components/Common'

type Props = {
  loading: boolean,
  smallChartsData: Object,
}

const MarketsPageRenderer = (props: Props) => {
  const {
    intl,
    loading,
    smallChartsData,
  } = props

  return (
    <WalletPageBox>
      {loading ? (
        <CenteredSpinner />
      ) : (
        <React.Fragment>
          <StatsWrapper>
            {
              smallChartsData &&
              smallChartsData.map((coin, index) => {
                return (<StatsBox key={index} {...coin} intl={intl} />)
              })
            }
          </StatsWrapper>
          
          <MarketsTable />
        </React.Fragment>
      )}
    </WalletPageBox>
  )
}

const StatsBox = ({code, change, price, volume, data, intl}) => {
  return (
    <StatsContent>
      <StatsInfo>
        <StatsRow>
          <StatsTitle>{code} Index</StatsTitle>
          <StatsChange color={change >=0 ? '#00C38C' : '#f94d5c'}>
            <SmallText>{change > 0 ? `+${BigNumber(change).toFormat(2)}` : BigNumber(change).toFormat(2)}%</SmallText>
          </StatsChange>
        </StatsRow>

        <StatsRow>
          <StatsPrice color={change >=0 ? '#00C38C' : '#f94d5c'}>{BigNumber(price).toFormat(2)} USD</StatsPrice>
          <StatsVolume title={intl.formatMessage({id: "app.volume"}, {volume: BigNumber(volume).toFormat(2)})}>
            <FormattedMessage 
              id="app.volume"
              values={{volume: BigNumber(volume).toFormat(2)}} />
          </StatsVolume>
        </StatsRow>
      </StatsInfo>
      <LineChart data={data} code={code} />
    </StatsContent>
  )
}

const StatsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const StatsContent = styled.div`
  display: flex;
  flex-direction: column;
  width: calc((100% - 60px)/4);
  height: 120px;
  position: relative;
  border: 1px solid ${props => props.theme.border};
  margin-bottom: 25px;
`

const StatsInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 15px 0 15px;

  @media (max-width: 1200px) {
    padding: 10px 10px 0 10px;
  }
`

const StatsRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const StatsCell = styled.div`
  margin-bottom: 5px;
  &:nth-child(2n) {
    text-align: right;
  }
  color: ${({color}) => color ? color : TmColors.WHITE};
  font-size: ${({fontSize}) => fontSize ? fontSize : '14px'};
`

const StatsTitle = styled(StatsCell)`
  color: ${props => props.theme.textSmallChart};

  @media (max-width: 1200px) {
    font-size: ${Theme.FONT_SIZE_SM};
  }
`

const StatsChange = styled(StatsCell)`
  > span {
    color: ${({color}) => color ? color : TmColors.WHITE};
  }  
`

const StatsPrice = styled(StatsCell)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 50%;

  @media (max-width: 1200px) {
    font-size: ${Theme.FONT_SIZE_SM};
  }
`

const StatsVolume = styled(StatsCell)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: ${Theme.FONT_SIZE_SM};
  color: ${props => props.theme.textSmallChart};
  width: 50%;
`

const WalletPageBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`

export default injectIntl(MarketsPageRenderer)
