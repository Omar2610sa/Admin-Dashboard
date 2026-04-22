import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../Layout/SideBar/Sidebar';
import Header from './Header/Header';

const MainLayout = () => {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/app/')) {
      const page = path.split('/').pop() || 'dashboard';
      setCurrentPage(page);
    }
  }, [location]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500'>
      <div className='flex h-screen overflow-hidden'>
        <Sidebar 
          collapsed={sideBarCollapsed} 
          onToggle={() => setSideBarCollapsed(!sideBarCollapsed)}
          currentPage={currentPage} 
          onPageChange={(page) => {
            setCurrentPage(page);
            navigate(`/app/${page}`);
          }} 
        />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <Header 
            sideBarCollapsed={sideBarCollapsed} 
            onToggle={() => setSideBarCollapsed(!sideBarCollapsed)} 
          />
          <main className='flex-1 overflow-y-auto p-6'>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
