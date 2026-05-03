import React from 'react';
import { useTranslation } from 'react-i18next';
import DashboardCard from '../components/DashboardCard/DashboardCard';
import i18n from "i18next";


// Moment
import moment from 'moment';
import 'moment/min/locales';

const Dashboard = () => {
  const { t } = useTranslation();

  const isArabic = i18n.language === "ar";
  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className=''>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white">{t('Dashboard')}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{t('welcomBack')}</p>
        </div>
        <div className='bg-slate-200/30 dark:bg-slate-700/40 rounded-b-xl px-8 py-2 flex flex-col justify-center items-center'>
          <h2 className=' font-black text-slate-800 dark:text-white'>{t('todayDate')}</h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {
              moment().subtract(10, 'days').locale(isArabic ? 'ar' : 'en').calendar()
            }
          </p>
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
