import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div>
      <nav>
        <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
      </nav>
      <hr />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;