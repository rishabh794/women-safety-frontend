import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('authToken');
      const updatedData = { name, email };
      if (password) {
        updatedData.password = password;
      }

      await axios.put('http://localhost:3000/api/user/update', updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Profile updated successfully! Please re-login to see changes.');
      setPassword('');
      logout();
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete('http://localhost:3000/api/user/remove', {
      headers: { Authorization: `Bearer ${token}` },
      data: { email: user.email }
    });
      alert('Account deleted successfully.');
      logout();
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account.');
    }
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h2>Your Profile</h2>
      <form onSubmit={handleUpdateProfile}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password (optional)"
        />
        <button type="submit">Update Profile</button>
      </form>
      <hr />
      <h3>Delete Account</h3>
      <p>This action is permanent and cannot be undone.</p>
      <button onClick={handleDeleteAccount} style={{ backgroundColor: 'red', color: 'white' }}>
        Delete My Account
      </button>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ProfilePage;