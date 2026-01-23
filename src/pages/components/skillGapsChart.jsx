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

const SkillGapsChart = ({ data = null }) => {
  const defaultData = {
    labels: ['Advanced AI/ML', 'Cloud Security', 'Project Management'],
    datasets: [
      {
        label: 'Candidates with Gap (%)',
        data: [60, 45, 30],
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgb(34, 197, 94)',
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
        text: 'Skill Gaps in Candidates',
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
        max: 60
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Skill Gaps in Candidates</h3>
      <p className="text-sm text-gray-600 mb-6">
        Most frequently identified skill deficiencies across applicants.
      </p>
      <div className="h-[300px]">
        <Bar data={data || defaultData} options={options} />
      </div>
    </div>
  );
};

export default SkillGapsChart;