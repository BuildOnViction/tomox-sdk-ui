// @flow
import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import CenteredSpinner from '../../components/Common/CenteredSpinner'
import MarketsTable from '../../components/MarketsTable'
import LineChart from '../../components/LineChart/LineChart'
import { SmallText, TmColors } from '../../components/Common'

type Props = {
  loading: boolean,
  smallChartsData: Object,
}

const MarketsPageRenderer = (props: Props) => {
  const {
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
                return (<StatsBox key={index} {...coin} />)
              })
            }
          </StatsWrapper>
          
          <MarketsTable />
        </React.Fragment>
      )}
    </WalletPageBox>
  )
}

const StatsBox = ({code, change, price, volume, data}) => {
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
          <StatsVolume><StatsVolumeText muted>Volume:</StatsVolumeText> <StatsVolumeText>{BigNumber(volume).toFormat(2)}</StatsVolumeText></StatsVolume>
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
`

const StatsChange = styled(StatsCell)`
  > span {
    color: ${({color}) => color ? color : TmColors.WHITE};
  }  
`

const StatsPrice = styled(StatsCell)``

const StatsVolume = styled(StatsCell)``

const StatsVolumeText = styled(SmallText)`
  color: ${props => props.theme.textSmallChart};
`

const WalletPageBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`

export default MarketsPageRenderer
