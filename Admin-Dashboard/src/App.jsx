import React from 'react'
import Sidebar from './components/Layout/SideBar/Sidebar'
import Header from './components/Layout/Header/Header'

import { useState } from "react";

import "./language/i18n";
const App = () => {

  const [sideBarCollapsed, setSideBarCollapsed] = useState(false)
  const [currentPage, setCurrentPage] = useState("dashboard")


  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500'>
      <div className='flex h-screen overflow-hidden'>
        <Sidebar collapsed={sideBarCollapsed} onToggle={() => setSideBarCollapsed(sideBarCollapsed)}
          currentPage ={currentPage} onPageChange={setCurrentPage} />
        <div className='flex-1 flex flex-col overflow-hidden'>
          <Header sideBarCollapsed={sideBarCollapsed} onToggle={() => setSideBarCollapsed(!sideBarCollapsed)} />

        </div>
      </div>

    </div>
  )
}

export default App