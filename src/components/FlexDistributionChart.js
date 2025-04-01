import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const FlexDistributionChart = ({ distributionPlan, reductionAmount }) => {
  // Format data for chart
  const data = distributionPlan.map((item) => {
    const date = new Date(item.month);
    return {
      month: date.toLocaleString('default', { month: 'short' }),
      year: date.getFullYear(),
      amount: item.additionalAmount,
      fullDate: date
    };
  });
  
  // Sort by date
  data.sort((a, b) => a.fullDate - b.fullDate);
  
  // Limit to first 12 months for visualization
  const limitedData = data.slice(0, 12);
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={limitedData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis domain={[0, 'dataMax']} />
        <Tooltip 
          formatter={(value) => [`₪${value.toFixed(0)}`, 'תוספת חודשית']}
          labelFormatter={(label) => `חודש החזר: ${label}`}
        />
        <ReferenceLine 
          y={reductionAmount / distributionPlan.length} 
          stroke="#ff9e1b" 
          strokeDasharray="3 3"
          label={{ value: 'החזר בסיסי', position: 'right', fill: '#ff9e1b' }}
        />
        <Bar dataKey="amount" fill="#0055a4" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default FlexDistributionChart;