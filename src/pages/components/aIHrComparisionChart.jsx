import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AIHRComparisonChart = ({ data = null }) => {
  const defaultData = {
    labels: ['Recommended by AI', 'Shortlisted by AI', 'Hired by HR', 'Rejected by AI'],
    datasets: [
      {
        label: 'AI Decision (%)',
        data: [80, 60, 40, 20],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'HR Decision (%)',
        data: [70, 50, 60, 10],
        backgroundColor: 'rgba(249, 115, 22, 0.8)',
        borderColor: 'rgb(249, 115, 22)',
        borderWidth: 1,
        borderRadius: 4,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'AI vs HR Decision Comparison',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Percentage'
        },
        max: 100
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">AI vs HR Decision Comparison</h3>
      <p className="text-sm text-gray-600 mb-6">
        Comparing AI recommendations against final HR hiring decisions.
      </p>
      <div className="h-[300px]">
        <Bar data={data || defaultData} options={options} />
      </div>
    </div>
  );
};

export default AIHRComparisonChart;