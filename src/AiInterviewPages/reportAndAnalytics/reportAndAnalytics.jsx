import React, { useState } from 'react';
import TimeToHireChart from '@/pages/components/timeToHireChart';
import SkillGapsChart from '@/pages/components/skillGapsChart';
import AIHRComparisonChart from '@/pages/components/aIHrComparisionChart';
import BestPerformingRolesChart from '@/pages/components/bestPerformingRolesChart';
// import FilterDropdown from '@/components/FilterDropdown';
import Select from '@/components/ui/Select';

const ReportsAnalytics = () => {
  const [filters, setFilters] = useState({
    period: 'last30days',
    jobRole: 'all',
    team: 'all'
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // In future, you can use filters to fetch API data
  // Example: const { data, loading } = useReportsData(filters);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between flex-wrap items-center mb-6">
        <div>
          <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900">
            Reports & Analytics
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            Track hiring metrics and performance indicators
          </p>
        </div>
        <div className="text-sm text-gray-500">
          Welcome back, Admin
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          
          <Select 
            label="Time Period"
            options={[
              { value: 'last7days', label: 'Last 7 Days' },
              { value: 'last30days', label: 'Last 30 Days' },
              { value: 'last90days', label: 'Last 90 Days' },
              { value: 'lastyear', label: 'Last Year' }
            ]}
            value={filters.period}
            onChange={(value) => handleFilterChange('period', value)}
          />

          <Select 
            label="Job Role"
            options={[
              { value: 'all', label: 'All Job Roles' },
              { value: 'engineering', label: 'Engineering' },
              { value: 'design', label: 'Design' },
              { value: 'hr', label: 'HR' },
              { value: 'marketing', label: 'Marketing' }
            ]}
            value={filters.jobRole}
            onChange={(value) => handleFilterChange('jobRole', value)}
          />

          <Select 
            label="Team"
            options={[
              { value: 'all', label: 'All Teams' },
              { value: 'tech', label: 'Tech Team' },
              { value: 'product', label: 'Product Team' },
              { value: 'operations', label: 'Operations' }
            ]}
            value={filters.team}
            onChange={(value) => handleFilterChange('team', value)}
          />
        </div>
        <div>
             {/* Export Actions */}
      <div className="flex justify-end gap-4">
        <button className="bg-white text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-300 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          Export as PDF
        </button>
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Data (CSV)
        </button>
      </div>
        </div>
      </div>

      {/* Stats Summary */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Average Time-to-Hire</h3>
          <p className="text-3xl font-bold text-indigo-600 mt-2">22 Days</p>
          <p className="text-sm text-gray-600 mt-1">↗ 12% improvement</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Total Hires</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">156</p>
          <p className="text-sm text-gray-600 mt-1">↗ 8% from last period</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">AI-HR Match Rate</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">84%</p>
          <p className="text-sm text-gray-600 mt-1">↗ 5% improvement</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Skill Gap Avg.</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">45%</p>
          <p className="text-sm text-gray-600 mt-1">↘ 3% reduction</p>
        </div>
      </div> */}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TimeToHireChart />
        <BestPerformingRolesChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SkillGapsChart />
        <AIHRComparisonChart />
      </div>

     
    </div>
  );
};

export default ReportsAnalytics;