'use client';

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface PieChartProps {
  title: string;
  labels: string[];
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
  borderWidth?: number;
}

const defaultColors = [
  'rgba(54, 162, 235, 0.6)',   // Blue
  'rgba(255, 99, 132, 0.6)',    // Red
  'rgba(75, 192, 192, 0.6)',    // Green
  'rgba(255, 206, 86, 0.6)',    // Yellow
  'rgba(153, 102, 255, 0.6)',   // Purple
  'rgba(255, 159, 64, 0.6)',    // Orange
  'rgba(199, 199, 199, 0.6)',   // Gray
  'rgba(83, 102, 255, 0.6)',    // Indigo
  'rgba(255, 99, 255, 0.6)',    // Pink
  'rgba(99, 255, 132, 0.6)',    // Light Green
];

const PieChart: React.FC<PieChartProps> = ({ 
  title, 
  labels, 
  data, 
  backgroundColor = defaultColors,
  borderColor,
  borderWidth = 1
}) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
        }
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColor.slice(0, data.length),
        borderColor: borderColor || backgroundColor.map(color => 
          color.replace('0.6', '1')
        ).slice(0, data.length),
        borderWidth,
      },
    ],
  };

  return (
    <div className="w-full h-80">
      <Pie options={options} data={chartData} />
    </div>
  );
};

export default PieChart;