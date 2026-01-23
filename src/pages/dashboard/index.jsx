import React from "react";
import Group from "@/assets/images/icon/group.svg";
import AI from "@/assets/images/icon/ai.svg";
import messageIcon from "@/assets/images/icon/message-square-text.svg";
import checkIcon from "@/assets/images/icon/check-check.svg";
import HiringFunnelChart from "@/pages/components/hiringFunnelChart";
import PassFailChart from "@/pages/components/passFailChart";
import StatCard from "@/pages/components/stateCard";

const Dashboard = () => {
 const stats = [
    { 
      title: 'Total CVs Received', 
      value: 1245, 
      change: 15, 
      iconSrc: Group, // Pass as src prop
      isNegative: false 
    },
    { 
      title: 'Shortlisted by AI', 
      value: 380, 
      change: 22, 
      iconSrc: AI, // Pass as src prop
      isNegative: false 
    },
    { 
      title: 'Interviews Completed', 
      value: 160, 
      change: 10, 
      iconSrc: messageIcon, // Pass as src prop
      isNegative: false 
    },
    { 
      title: 'Ready to Hire', 
      value: 28, 
      change: -5, 
      iconSrc: checkIcon, // Pass as src prop
      isNegative: true 
    }
  ];
  return (
    <div>
      <div className="flex justify-between flex-wrap items-center mb-6">
        <h4 className="font-medium lg:text-2xl text-xl capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
          Dashboard
        </h4>
        <div className="text-sm text-gray-500">
          Welcome back, Admin
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <HiringFunnelChart />
        <PassFailChart />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Job
        </button>
        <button className="bg-white text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-300 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          View Top Candidates
        </button>
      </div>
    </div>
  );
};

export default Dashboard;