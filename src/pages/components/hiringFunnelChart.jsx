import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HiringFunnelChart = () => {
  // Data for the chart
  const data = {
    labels: ['CVs Received', 'Shortlisted by AI', 'Interviews Completed', 'Ready to Hire'],
    datasets: [
      {
        label: 'Candidates',
        data: [1245, 380, 160, 28],
        backgroundColor: [
          'rgba(99, 106, 232, 1)',    // Blue for CVs
          'rgba(99, 106, 232, 1)',    // Purple for Shortlisted
          'rgba(99, 106, 232, 1)',    // Green for Ready to Hire
        ],
        borderColor: [
          'rgba(99, 106, 232, 1)',
          'rgba(99, 106, 232, 1)',
          'rgba(99, 106, 232, 1)',
        ],
        borderWidth: 1,
        borderRadius: 8,
        borderSkipped: false,
      }
    ]
  };

  const options = {
    indexAxis: 'y', // Horizontal bar chart
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.x.toLocaleString();
            label += ` (${Math.round((context.parsed.x / 1245) * 100)}%)`;
            return label;
          }
        }
      },
      // title: {
      //   display: true,
      //   text: 'Hiring Funnel',
      //   font: {
      //     size: 16,
      //     weight: 'bold'
      //   },
      //   padding: {
      //     bottom: 20
      //   }
      // }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            return value.toLocaleString();
          }
        },
      },
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 14,
            weight: '500'
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h1 className=" font-medium text-[20px] leading-[28px] tracking-[-0.5px]">
        Hiring Funnel
      </h1>
      <div className="h-80">
        <Bar data={data} options={options} />
      </div>

    </div>
  );
};

export default HiringFunnelChart;