import React from 'react';
import DashboardCard from '../components/DashboardCard/DashboardCard';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Welcome back! Here's what's happening with your store today.</p>
        </div>
      </div>
      {/* Cards */}
      <div className="">
        <DashboardCard />

      </div>
    </div>
  );
};

export default Dashboard;
