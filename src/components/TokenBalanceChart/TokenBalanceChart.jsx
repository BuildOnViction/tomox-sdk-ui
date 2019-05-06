import React from 'react';
import TokenBalanceChartRenderer from './TokenBalanceChartRenderer';
import { Sector } from 'recharts';
import { Colors } from '../Common';
import { formatNumber } from 'accounting-js'

const colors = ['#f28f43', '#5384ba', '#0d233a', '#8bbc21', '#910000', '#1aadce','#492970', '#77a1e5', '#c42525', '#a6c96a']

type State = {
  activeIndex: number
};

export type Props = {
  tokenBalances: Array<Object>,
  balancesLoading: boolean
};

export default class TokenBalanceChart extends React.PureComponent<
  Props,
  State
> {
  state = { activeIndex: 0 };

  onPieEnter = (data: Object, index: number) => {
    this.setState({ activeIndex: index });
  };

  renderLabels = (props: *) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius } = props;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        <text
          x={x}
          y={y}
          fill="white"
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline="central"
        >
          hello
        </text>
      </g>
    );
  };

  renderActiveShape = (props: *) => {
    // const RADIAN = Math.PI / 180;
    const {
      cx,
      cy,
      // midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      payload,
      percent,
      value, 
      fill,
    } = props;
    // const sin = Math.sin(-RADIAN * midAngle);
    // const cos = Math.cos(-RADIAN * midAngle);
    // const sx = cx + (outerRadius + 10) * cos;
    // const sy = cy + (outerRadius + 10) * sin;
    // const mx = cx + (outerRadius + 30) * cos;
    // const my = cy + (outerRadius + 30) * sin;
    // const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    // const ey = my;
    // const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 5}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          // fill={Colors.PRIMARY}
          stroke={Colors.APP_BACKGROUND}
        />
        {/* <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          stroke={Colors.APP_BACKGROUND}
          fill={Colors.BLUE5}
        /> */}
        {/* <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	style={{"font-size": 20}} fill={Colors.WHITE} dominantBaseline="central">{payload.symbol}</text> */}
        <text
          x={cx}
          y={cy}
          dy={0}
          style={{ fontSize: 30 }}
          textAnchor='middle'
          fill={Colors.WHITE}
        >
          {`${(percent * 100).toFixed(2)}%`}
        </text>
        <text
          x={cx}
          y={cy}
          dy={26}
          style={{ fontSize: 20 }}
          textAnchor="middle"
          fill={fill}
          // fill={Colors.WHITE}
        >
          {formatNumber(value, {precision: 2})} {payload.symbol}
        </text>
        {/* <path
          d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
          stroke={Colors.BLUE5}
          fill="none"
        /> */}
        {/* <circle
          cx={ex}
          cy={ey}
          r={2}
          fill={Colors.PRIMARY}
          stroke={Colors.BLUE5}
        /> */}
        {/* <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill={Colors.WHITE}
        >{`Balance ${value} ${payload.symbol}`}</text>
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          dy={18}
          textAnchor={textAnchor}
          fill={Colors.WHITE}
        >
          {`(${(percent * 100).toFixed(2)}%)`}
        </text> */}
      </g>
    );
  };

  render() {
    const { activeIndex } = this.state;
    const { tokenBalances, balancesLoading } = this.props;
    const isEmpty = tokenBalances.length === 0;

    return (
      <TokenBalanceChartRenderer
        balancesLoading={balancesLoading}
        activeIndex={activeIndex}
        data={tokenBalances}
        renderActiveShape={this.renderActiveShape}
        renderLabels={this.renderLabels}
        onPieEnter={this.onPieEnter}
        isEmpty={isEmpty}
        colors={colors}
      />
    );
  }
}
