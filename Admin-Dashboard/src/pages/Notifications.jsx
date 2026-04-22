import React from 'react';

const Notifications = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">Notifications</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage notifications.</p>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-100 dark:border-slate-700">
        <p>Notifications list placeholder</p>
      </div>
    </div>
  );
};

export default Notifications;

