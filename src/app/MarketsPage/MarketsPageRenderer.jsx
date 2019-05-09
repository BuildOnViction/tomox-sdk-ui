// @flow
import React from 'react'
import styled from 'styled-components'
import CenteredSpinner from '../../components/Common/CenteredSpinner'
import MarketsTable from '../../components/MarketsTable'
import LineChart from '../../components/LineChart/LineChart'
import { SmallText } from '../../components/Common'

type Props = {
  loading: boolean,
}

// Todo: remove when have real data
const fakeTokens = [
  {
    token: 'BTC',
    change: 2.09,
    price: '3,973',
    volume: '9,427',
  },
  {
    token: 'ETH',
    change: -2.58,
    price: '138.69',
    volume: '4,697',
  },
  {
    token: 'XRP',
    change: 1.82,
    price: '0.31',
    volume: '2,697',
  },
  {
    token: 'TOMO',
    change: 2.01,
    price: '2,65',
    volume: '5,697',
  },
]

const MarketsPageRenderer = (props: Props) => {
  const {
    loading,
  } = props

  return (
    <WalletPageBox>
      {loading ? (
        <CenteredSpinner />
      ) : (
        <React.Fragment>
          <StatsWrapper>
            {
              fakeTokens.map((token, index) => {
                return (<StatsBox key={index} {...token} />)
              })
            }
          </StatsWrapper>
          
          <MarketsTable />
        </React.Fragment>
      )}
    </WalletPageBox>
  )
}

const StatsBox = ({token, change, price, volume}) => {
  return (
    <StatsContent>
      <StatsInfo>
        <StatsTitle>{token} Index</StatsTitle>
        <StatsChange color={change >=0 ? '#00C38C' : '#f94d5c'}>
          <SmallText>{change > 0 ? `+${change}` : change}%</SmallText>
        </StatsChange>
        <StatsPrice color={change >=0 ? '#00C38C' : '#f94d5c'}>{price} USD</StatsPrice>
        <StatsVolume><SmallText muted>Volume:</SmallText> <SmallText>{volume}</SmallText></StatsVolume>
      </StatsInfo>
      <LineChart />
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
  border: 1px solid #394362;
  margin-bottom: 25px;
`

const StatsInfo = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 15px 15px 0 15px;
`

const StatsCell = styled.div`
  width: 50%;
  margin-bottom: 5px;
  &:nth-child(2n) {
    text-align: right;
  }
  color: ${({color}) => color ? color : '#fff'};
  font-size: ${({fontSize}) => fontSize ? fontSize : '14px'};
`

const StatsTitle = styled(StatsCell)`
`

const StatsChange = styled(StatsCell)`
  > span {
    color: ${({color}) => color ? color : '#fff'};
  }  
`

const StatsPrice = styled(StatsCell)``

const StatsVolume = styled(StatsCell)``

const WalletPageBox = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
`

export default MarketsPageRenderer
