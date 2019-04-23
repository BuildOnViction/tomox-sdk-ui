import React from 'react'
import { ResponsiveContainer, LineChart, Line } from 'recharts'

const LineChartRenderer = ({ data, colors }) => {
  const timestamp = new Date().getUTCMilliseconds();

  return (
    <ResponsiveContainer width='100%' height='60%'>
      <LineChart data={data} margin={{ top: 0, bottom: 3, right: 0, left: 0 }}>
        <defs>
          <linearGradient id={timestamp} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="50%" stopColor={colors[1]} />
            <stop offset="100%" stopColor={colors[2]} />
          </linearGradient>
        </defs>

        <Line id={new Date().getTime().toString()} type="basis" dataKey="price" stroke={`url(#${timestamp}`} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default LineChartRenderer
