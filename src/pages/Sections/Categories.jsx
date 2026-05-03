import React from 'react';

const Categories = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">Categories</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage categories.</p>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-xl border border-slate-100 dark:border-slate-700">
        <p>Categories table placeholder</p>
      </div>
    </div>
  );
};

export default Categories;

