import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
    window.location.reload();
  };


  const handleSOS = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    const getLocation = () => new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    try {
      alert("Requesting your location... Please approve the browser request.");
      const position = await getLocation();
      const { latitude, longitude } = position.coords;

      console.log('Location fetched:', { latitude, longitude });
      
      // --- SENDING TO BACKEND ---
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert("You are not logged in!");
        return;
      }

      await axios.post(
        'http://localhost:3000/api/alerts', 
        { latitude, longitude },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('SOS signal successfully sent to the server!');

    } catch (error) {
      // This will catch errors from both geolocation and the axios call
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
      console.error("Failed to send SOS:", errorMessage);
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div>
      <h1>Welcome!</h1>
      <p>Your Dashboard</p>
      <button onClick={handleSOS}>SEND SOS ALERT</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default HomePage;