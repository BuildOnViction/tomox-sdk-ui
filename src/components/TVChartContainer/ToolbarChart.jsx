import React from 'react'
import styled from 'styled-components'
import { IndicatorSelect, StandardSelect } from '../SelectMenu'
// import { Button } from '@blueprintjs/core'

export const ToolbarChart = ({
  state,
  onUpdateIndicators,
  changeTimeSpan,
  currentTimeSpan,
  currentDuration,
  updateProps,
  changeDuration,
  changeChartType,
  indicators,
  isOpen,
  toggleCollapse,
}) => (
  <ToolbarWrapper>
    <IntervalMenu 
      intervals={state.timeSpans}
      currInterval={currentTimeSpan || state.timeSpans[0]}
      changeTimeSpan={changeTimeSpan}
    />
    {/* <ChartTypeMenu>
      <StandardSelect
        items={state.chartTypes}
        item={state.currentChart || state.chartTypes[0]}
        handleChange={changeChartType}
        icon="series-configuration"
        type="icon"
      />
    </ChartTypeMenu> */}
    {/* <TimeSpanMenu> */}
      {/* <StandardSelect
        items={state.timeSpans}
        item={currentTimeSpan || state.timeSpans[0]}
        handleChange={changeTimeSpan}
        icon="series-add"
        type="text"
      /> */}
    {/* </TimeSpanMenu> */}

    {/* <DurationMenu
      duration={state.duration}
      currentDuration={currentDuration}
      changeDuration={changeDuration}
    /> */}

    {/* <TimeSpanMenu>
      <IndicatorSelect
        indicators={state.indicators}
        onUpdateIndicators={onUpdateIndicators}
      />
    </TimeSpanMenu> */}
    {/* <Button
      icon={isOpen ? 'chevron-up' : 'chevron-down'}
      minimal
      onClick={toggleCollapse}
    /> */}
  </ToolbarWrapper>
)

const IntervalMenu = ({ intervals, currInterval, changeTimeSpan }) => {
  return (
    <IntervalWrapper>
      {
        intervals.map((interval, index) => {
          return (
            <Interval
              key={index}
              onClick={() => changeTimeSpan(interval)}
              active={currInterval.label === interval.label}
              >{ interval.label }</Interval>
          )
        })
      }
    </IntervalWrapper>
  )
}

// const DurationMenu = ({ duration, changeDuration, currentDuration }) => {
//   return (
//     <DurationWrapper>
//       {duration.map((dur, index) => {
//         const { label } = dur
//         return (
//           <Button
//             key={index}
//             onClick={() => changeDuration(index)}
//             text={label}
//             minimal
//             intent={currentDuration.label === label ? 'primary' : ''}
//             active={currentDuration.label === label}
//           />
//         )
//       })}
//     </DurationWrapper>
//   )
// }

// const DurationWrapper = styled.div`
//   position: relative;
//   float: left;
//   margin-right: 25px;
//   display: flex;
//   padding: 0 !important;
//   flex-direction: row !important;
//   margin-right: 25px;
//   & button {
//     padding: 0 5px !important;
//   }
//   &:active {
//     background-color: transparent !important;
//   }
// `

const ToolbarWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  position: absolute;
  top: 0;
  left: 10px;

  @media only screen and (max-width: 1200px) {
    display: none;
  }
`

const IntervalWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`

const Interval = styled.div`
  width: 40px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  margin-right: 10px;
  color: ${(props) => props.active ? '#fff' : 'inherit'};
  font-size: 12px;
  background: ${(props) => props.active ? '#3f4a66' : '#1f263d'};
  cursor: pointer;
  &:hover {
    background: #3f4a66;
    color: #fff;
  }
  &:last-child {
    margin-right: 10px;
  }
`

// const ChartTypeMenu = styled.div`
//   position: relative;
//   float: left;
//   margin-right: 25px;
//   display: flex;
//   width: 30px;
//   flex-direction: column;
// `

// const TimeSpanMenu = styled.div`
//   position: relative;
//   float: left;
//   margin-right: 25px;
//   display: flex;
//   width: auto;
//   flex-direction: column;
// `