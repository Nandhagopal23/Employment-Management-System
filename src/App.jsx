import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import Departments from './pages/Departments';
import AuditLogs from './pages/AuditLogs';

const DashboardWrapper = () => {
  const { user } = useAuth();
  return user?.role === 'Employee' ? <EmployeeDashboard /> : <Dashboard />;
};

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />; // Not authorized
  }

  return children;
};

import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <PrivateRoute>
                  <DashboardWrapper />
                </PrivateRoute>
              }
            />

            <Route
              path="/departments"
              element={
                <PrivateRoute>
                  <Departments />
                </PrivateRoute>
              }
            />

            <Route
              path="/logs"
              element={
                <PrivateRoute roles={['Admin']}>
                  <AuditLogs />
                </PrivateRoute>
              }
            />

          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
