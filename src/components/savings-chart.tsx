"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

interface SavingsChartProps {
  yearlySavings: number;
  years?: number;
}

export function SavingsChart({ yearlySavings, years = 25 }: SavingsChartProps) {
  const data = Array.from({ length: years }, (_, i) => {
    const year = i + 1;
    // Assuming 5% electricity price hike annually
    const compoundingSavings = yearlySavings * ((Math.pow(1.05, year) - 1) / 0.05);
    return {
      year: `Year ${year}`,
      savings: Math.round(compoundingSavings),
    };
  });

  return (
    <div className="w-full h-[300px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888822" />
          <XAxis 
            dataKey="year" 
            hide 
          />
          <YAxis 
            hide 
            domain={[0, 'dataMax + 100000']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--card)', 
              borderRadius: '16px', 
              border: '1px solid rgba(79,70,229,0.1)',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Cumulative Savings']}
          />
          <Area 
            type="monotone" 
            dataKey="savings" 
            stroke="#4f46e5" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorSavings)" 
            animationDuration={2000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
