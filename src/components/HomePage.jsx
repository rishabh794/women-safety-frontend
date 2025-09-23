import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Map from './Map';
import { useAuth } from '../hooks/useAuth';
import { socket } from '../socket';

const HomePage = () => {
  const [location, setLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [alert, setAlert] = useState(null);
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
      const response = await axios.post(
        'http://localhost:3000/api/alerts',
        { latitude: 0, longitude: 0 }, // Initial dummy location
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newAlert = response.data.alert;
      setAlert(newAlert);
      socket.emit('join-alert-room', newAlert.id);

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation([latitude, longitude]);
          socket.emit('location-update', {
            alertId: newAlert.id,
            latitude,
            longitude,
          });
        },
        (error) => {
          console.error("Error watching position:", error);
          stopTracking();
        },
        { enableHighAccuracy: true }
      );

      setIsTracking(true);
    } catch (error) {
      alert('Could not start SOS. Please try again.',error);
    }
  };

  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    // In a real app, we might also emit a 'stop-tracking' event
    // and update the alert status in the DB to 'resolved'.
    setIsTracking(false);
    setAlert(null);
    setLocation(null);
  };


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
          <p>Alert ID: {alert?.id}</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;