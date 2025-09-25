import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { socket } from '../socket';
import Map from './Map';

const GuardianView = () => {
  const [location, setLocation] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState('');
  const { alertId } = useParams();

  useEffect(() => {
    const fetchInitialAlert = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/alerts/${alertId}`);
        const initialAlert = response.data.alert;
        setLocation([initialAlert.latitude, initialAlert.longitude]);
      } catch (err) {
        setError("Could not find the requested alert.",err);
      }
    };

    fetchInitialAlert();
    socket.connect();

    function onConnect() {
      setIsConnected(true);
      socket.emit('join-alert-room', alertId);
    }
    function onDisconnect() {
      setIsConnected(false);
    }
    function onNewLocation(data) {
      setLocation([data.latitude, data.longitude]);
    }
    function onAlertResolved() {
      setIsConnected(false);
      alert('The user has ended the SOS alert.');
      socket.disconnect();
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new-location', onNewLocation);
    socket.on('alert-resolved', onAlertResolved);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new-location', onNewLocation);
      socket.off('alert-resolved', onAlertResolved);
      socket.disconnect();
    };
  }, [alertId]);

  const googleMapsUrl = location
    ? `https://www.google.com/maps?q=${location[0]},${location[1]}`
    : '#';

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Live Tracking for Alert</h1>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      
      {location ? (
        <>
          <Map position={location} />
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
            Open in Google Maps
          </a>
        </>
      ) : (
        <p>Fetching initial location...</p>
      )}
    </div>
  );
};

export default GuardianView;