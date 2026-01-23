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

const BestPerformingRolesChart = ({ data = null }) => {
  const defaultData = {
    labels: ['Software Engineer', 'Data Scientist', 'HR Specialist', 'Product Designer'],
    datasets: [
      {
        label: 'Number of Hires',
        data: [60, 45, 30, 15],
        backgroundColor: 'rgba(147, 51, 234, 0.8)',
        borderColor: 'rgb(147, 51, 234)',
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
        text: 'Best Performing Job Roles',
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
          text: 'Number of Hires'
        },
        max: 60
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Best Performing Job Roles</h3>
      <p className="text-sm text-gray-600 mb-6">
        Job roles with the highest successful hire rate.
      </p>
      <div className="h-[300px]">
        <Bar data={data || defaultData} options={options} />
      </div>
    </div>
  );
};

export default BestPerformingRolesChart;