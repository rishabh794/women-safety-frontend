import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav>
        <Link to="/dashboard">Home</Link> | 
        <Link to="/dashboard/guardians">Guardians</Link> | 
        <Link to="/dashboard/profile">Profile</Link>
        {user?.isAdmin && <span> | <Link to="/dashboard/admin">Admin Dashboard</Link></span>}
        | <button onClick={handleLogout}>Logout</button>
        <span> (Logged in as: {user?.name})</span>
      </nav>
      <hr />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;