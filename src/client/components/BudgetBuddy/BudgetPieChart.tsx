// 📄 File: src/client/components/BudgetBuddy/BudgetPieChart.tsx

import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import api from './api';
import { Box, Typography } from '@mui/material';

interface BudgetCategory {
  id: number;
  category: string;
  spent: number;
}

const BudgetPieChart: React.FC = () => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);

  useEffect(() => {
    api.get('/categories')
      .then(res => {
        console.log("Fetched category data:", res.data); //debugg
        setCategories(res.data);
      })
      .catch(err => {
        console.error(' Error fetching categories:', err);
      });
  }, []);
  

  // Convert to MUI PieChart format
  const pieData = categories.map((item) => {
    console.log("Pie chart data:", pieData); //debugg

    const fallbackLabel = `Category ${item.id}`;
    const label = typeof item.category === 'string' && item.category.trim() !== ''
      ? item.category
      : fallbackLabel;
  
    return {
      id: item.id,
      value: item.spent,
      label
    };
  });
  

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      <Typography variant="h6" gutterBottom>
        Budget Distribution
      </Typography>

      {pieData.length === 0 ? (
        <Typography>No budget data yet.</Typography>
      ) : (
        <PieChart
          series={[{ data: pieData }]}
          width={400}
          height={300}
          slotProps={{ legend: { hidden: false } }}
        />
      )}
    </Box>
  );
};

export default BudgetPieChart;
