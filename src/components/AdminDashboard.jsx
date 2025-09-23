import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] =  useState([]);
  const [alerts, setAlerts] =  useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Bearer ${token}` };
        
        const usersResponse =  await axios.get('http://localhost:3000/api/admin/all-users', { headers });
        const alertsResponse = await axios.get('http://localhost:3000/api/admin/alerts', { headers });

        setUsers(usersResponse.data.users);
        setAlerts(alertsResponse.data.alerts);
      } catch (err) {
        setError('Failed to fetch admin data.',err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading Admin Dashboard...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      
      <h3>All Users ({users.length})</h3>
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid grey' }}>
        {users.map(user => (
          <div key={user.id} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Admin:</strong> {user.isAdmin.toString()}</p>
          </div>
        ))}
      </div>

      <h3>All Alerts ({alerts.length})</h3>
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid grey', marginTop: '20px' }}>
        {alerts.map(alert => (
          <div key={alert.id} style={{ padding: '5px', borderBottom: '1px solid #eee' }}>
            <p><strong>ID:</strong> {alert.id}</p>
            <p><strong>User ID:</strong> {alert.userId}</p>
            <p><strong>Status:</strong> {alert.status}</p>
            <p><strong>Location:</strong> Lat: {alert.latitude}, Lon: {alert.longitude}</p>
            <p><strong>Time:</strong> {new Date(alert.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;