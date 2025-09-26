import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Signup from './components/Signup';
import HomePage from './components/HomePage';
import GuardiansPage from './components/GuardiansPage';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/AdminDashboard';
import GuardianView from './components/GuardianView';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AppLayout from './components/AppLayout';
import PublicLayout from './components/PublicLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      <Route element={<PublicLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route path="/track/:alertId" element={<GuardianView />} />

      <Route 
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="" element={<HomePage />} />
        <Route path="guardians" element={<GuardiansPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route 
          path="admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
      </Route>
    </Routes>
  );
}

export default App;