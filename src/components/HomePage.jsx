import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Map from './Map';
import { useAuth } from '../hooks/useAuth';
import { socket } from '../socket';

const HomePage = () => {
  const [location, setLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [alertData, setAlertData] = useState(null);
  const watchIdRef = useRef(null);

  const { user } = useAuth();

  useEffect(() => {
    socket.connect();
    function onConnect() {
      console.log('Connected to WebSocket server!');
    }
    socket.on('connect', onConnect);
    return () => {
      socket.off('connect', onConnect);
      socket.disconnect();
    };
  }, []);

 const startTracking = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert("Authentication error. Please log in again.");
        return;
      }

      const getLocation = () => new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
      });
      
      const position = await getLocation();
      const { latitude, longitude } = position.coords;
      
      setLocation([latitude, longitude]);

      const response = await axios.post(
        'http://localhost:3000/api/alerts',
        { latitude, longitude },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newAlert = response.data.alert;
      setAlertData(newAlert);
      socket.emit('join-alert-room', newAlert.id);

      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude: lat, longitude: lon } = pos.coords;
          setLocation([lat, lon]);
          socket.emit('location-update', {
            alertId: newAlert.id,
            latitude: lat,
            longitude: lon,
          });
        },
        (error) => {
          console.error("Error watching position:", error);
          stopTracking();
        },
        { enableHighAccuracy: true, }
      );

      setIsTracking(true);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "An unknown error occurred.";
      alert(`Could not start SOS: ${errorMessage}`);
    }
  };

 const stopTracking = () => {
    if (watchIdRef.current) {
      if (typeof watchIdRef.current === 'number') {
        navigator.geolocation.clearWatch(watchIdRef.current);
      } else {
        clearInterval(watchIdRef.current);
      }
      watchIdRef.current = null;
    }
    
    if (alertData) {
      socket.emit('stop-tracking', { alertId: alertData.id });
    }

    setIsTracking(false);
    setAlertData(null);
    setLocation(null);
  };

  const googleMapsUrl = location 
    ? `https://www.google.com/maps?q=${location[0]},${location[1]}`
    : '#';


  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      
      {!isTracking ? (
        <button onClick={startTracking}>START SOS</button>
      ) : (
        <button onClick={stopTracking}>STOP SOS</button>
      )}


      {isTracking && location && (
        <div>
          <h3>Live Tracking Active...</h3>
          <Map position={location} />
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
        Open in Google Maps
      </a>
          <p>Alert ID: {alertData?.id}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;