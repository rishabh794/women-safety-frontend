import React, { useState } from 'react';
import axios from 'axios';
import Map from './Map';

const HomePage = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const handleSOS = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setAlertSent(false);

    const getLocation = () => new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {  enableHighAccuracy: true });
    });

    try {
      const position = await getLocation();
      const { latitude, longitude } = position.coords;
      
      setLocation([latitude, longitude]);

      const token = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:3000/api/alerts',
        { latitude, longitude },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAlertSent(true);

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Welcome!</h1>
      <p>Your Dashboard</p>
      <button onClick={handleSOS} disabled={loading}>
        {loading ? 'Sending...' : 'SEND SOS ALERT'}
      </button>

      {location && (
        <div>
          <h3>Your Location:</h3>
          <Map position={location} />
          {alertSent && <p style={{ color: 'green' }}>Alert Sent Successfully!</p>}
        </div>
      )}
    </div>
  );
};

export default HomePage;