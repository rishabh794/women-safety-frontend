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
        <Link to="/">Home</Link> | <Link to="/guardians">Guardians</Link> | <Link to="/profile">Profile</Link>
        {user?.isAdmin && <span> | <Link to="/admin">Admin Dashboard</Link></span>}
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