// @flow
import React from 'react'
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts'
import { Colors, CenteredSpinner } from '../Common'
import { H4 } from '@blueprintjs/core'
import styled from 'styled-components'

type Props = {
  activeIndex: number,
  renderActiveShape: () => void,
  renderLabels: () => void,
  data: Array<Object>,
  onPieEnter: (Object, number) => void,
  balancesLoading: boolean,
  isEmpty: boolean
};

const TokenBalanceChartRenderer = (props: Props) => {
  const {
    activeIndex,
    renderActiveShape,
    data,
    onPieEnter,
    isEmpty,
    balancesLoading,
    colors,
  } = props

  if (balancesLoading)
    return (
      <LoadingChartBox>
        <CenteredSpinner />
      </LoadingChartBox>
    )

  if (isEmpty)
    return (
      <EmptyChartNotification>
        <H4>Your account is empty</H4>
      </EmptyChartNotification>
    )

  return (
    <ResponsiveContainer height={350} width="100%">
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          dataKey="value"
          data={data}
          cx={'50%'}
          cy={'55%'}
          innerRadius={100}
          outerRadius={130}
          fill={Colors.PRIMARY}
          stroke={Colors.APP_BACKGROUND}
          onMouseEnter={onPieEnter}
        >
          {
            data.map((entry, index) => <Cell key={index} fill={colors[index % colors.length]}/>)
          }
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

const LoadingChartBox = styled.div`
  height: 400px;
  width: 100%;
`

const EmptyChartNotification = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  height: 400px;
  align-items: center;
  align-content: center;
`

export default TokenBalanceChartRenderer
