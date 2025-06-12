import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { spendingParams } from '@/database/financeData';

export const Downtimes = () => {
  const getColorByValue = (value) => {
    if (value > 70) return '#EA5455'; // Rojo para valores altos
    if (value > 40) return '#FF9F43'; // Naranja para valores medios
    return '#28C76F'; // Verde para valores bajos
  };

  return (
    <Card>
      <CardContent className="dashboard-card">
        <h3 className="text-lg mb">Downtime</h3>
        <div className="dashboard-params-grid">
          {spendingParams.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray capitalize">{item.label}</span>
                <span className="font-medium">{item.value}%</span>
              </div>
              <Progress 
                value={item.value} 
                indicatorColor={getColorByValue(item.value)}
                className="h-2"
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};