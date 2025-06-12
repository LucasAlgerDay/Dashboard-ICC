import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { expensesData } from '@/database/financeData';
import { FiChevronDown } from 'react-icons/fi';

export const Efficiencyperhour = () => {
  return (
    <Card>
      <CardContent className="dashboard-card">
        <h3 className="text-lg mb">Efficiency per Hour</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={expensesData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#7367F0" 
              strokeWidth={2} 
              activeDot={{ r: 6 }} 
            />
            <Line 
              type="monotone" 
              dataKey="expense" 
              stroke="#EA5455" 
              strokeWidth={2} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};