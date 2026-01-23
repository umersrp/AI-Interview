import React from 'react';

const StatCard = ({ title, value, change, iconSrc, isNegative }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <p className="text-gray-600">{title}</p>
        <div className="bg-gray-100 p-3 rounded-lg">
          {iconSrc && <img src={iconSrc} alt={title} className="w-6 h-6" />}
        </div>
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mt-4 mb-2">
        {value.toLocaleString()}
      </h3>
      <span className={`text-sm font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change >= 0 ? '+' : ''}{change}% last month
      </span>
    </div>
  );
};

export default StatCard;