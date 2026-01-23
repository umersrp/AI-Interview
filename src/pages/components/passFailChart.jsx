import React from "react";
import Chart from "react-apexcharts";

const PassFailChart = () => {
  const overallData = {
    passed: 65,
    failed: 35,
  };

  const chartOptions = {
    chart: {
      type: 'donut',
      height: 300,
    },
    colors: ['#646AE8', '#DE3B40'],
    labels: ['Passed', 'Failed'],
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
        }
      }
    },
    dataLabels: {
      enabled: false,
      formatter: function (val) {
        return val.toFixed(1) + "%";
      },
      style: {
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif',
      },
      dropShadow: {
        enabled: false
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    stroke: {
      width: 0
    },
  };

  const chartSeries = [overallData.passed, overallData.failed];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h1 className="font-medium text-[20px] leading-[28px] tracking-[-0.5px] mb-6">
        Pass vs Fail Ratio
      </h1>
      
      <div className="flex flex-col items-center">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="donut"
          height={300}
          width="100%"
        />
        
        {/* <div className="grid grid-cols-2 gap-6 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{overallData.passed}%</div>
            <div className="text-sm text-gray-600 mt-1">Pass Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">{overallData.failed}%</div>
            <div className="text-sm text-gray-600 mt-1">Fail Rate</div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default PassFailChart;