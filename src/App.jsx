import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import HomePage from './components/HomePage';
import ProtectedRoute from './components/ProtectedRoute';
import GuardiansPage from './components/GuardiansPage';
import ProfilePage from './components/ProfilePage';
import AdminDashboard from './components/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav>
        {user ? (
          <>
            <Link to="/">Home</Link> | <Link to="/guardians">Guardians</Link> | <Link to="/profile">Profile</Link>
            {user.isAdmin && <span> | <Link to="/admin">Admin Dashboard</Link></span>}
            | <button onClick={handleLogout}>Logout</button>
            <span> (Logged in as: {user.name})</span>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
          </>
        )}
      </nav>
      <hr />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/guardians" element={<ProtectedRoute><GuardiansPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
    </div>
  );
}

export default App;