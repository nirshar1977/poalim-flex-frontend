import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';

const FinancialHealthChart = ({ predictions }) => {
  // Format data for chart
  const data = predictions.map((prediction) => ({
    month: prediction.month,
    expenses: prediction.predictedExpenses,
    income: prediction.predictedIncome,
    stressScore: prediction.stressScore * 100
  }));
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis yAxisId="left" orientation="left" />
        <YAxis 
          yAxisId="right" 
          orientation="right" 
          domain={[0, 100]} 
          label={{ value: 'מדד לחץ פיננסי %', angle: -90, position: 'right' }}
        />
        <Tooltip 
          formatter={(value, name) => [
            name === 'stressScore' ? `${value.toFixed(0)}%` : `₪${value.toLocaleString()}`,
            name === 'stressScore' ? 'מדד לחץ פיננסי' : name === 'expenses' ? 'הוצאות צפויות' : 'הכנסה צפויה'
          ]}
        />
        <Legend />
        <ReferenceLine yAxisId="right" y={50} stroke="#ff9e1b" strokeDasharray="3 3" label="סף אזהרה" />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="expenses" 
          stroke="#ef5350" 
          name="הוצאות צפויות"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        <Line 
          yAxisId="left"
          type="monotone" 
          dataKey="income" 
          stroke="#4caf50" 
          name="הכנסה צפויה"
          strokeWidth={2}
          activeDot={{ r: 8 }}
        />
        <Line 
          yAxisId="right"
          type="monotone" 
          dataKey="stressScore" 
          stroke="#ff9e1b" 
          name="מדד לחץ פיננסי"
          strokeWidth={3}
          dot={{ r: 6 }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default FinancialHealthChart;