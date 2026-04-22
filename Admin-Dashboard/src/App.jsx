import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Authentication/Login';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import AllUsers from './pages/Users/AllUsers';
import Roles from './pages/Users/Roles';
import Activity from './pages/Users/Activity';
import AllSections from './pages/Sections/AllSections';
import Categories from './pages/Sections/Categories';
import Inventory from './pages/Sections/Inventory';
import Notifications from './pages/Notifications';
import CountryPage from './pages/Country/Country';
import Settings from './pages/Settings';
import "./language/i18n";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route 
        path="/app/*" 
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="sections" element={<AllSections />} />
        <Route path="all-sections" element={<AllSections />} />
        <Route path="categories" element={<Categories />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="all-users" element={<AllUsers />} />
        <Route path="roles" element={<Roles />} />
        <Route path="activity" element={<Activity />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="Country" element={<CountryPage />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;

