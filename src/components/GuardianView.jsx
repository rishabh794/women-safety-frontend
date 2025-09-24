import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../socket';
import Map from './Map';

const GuardianView = () => {
  const [location, setLocation] = useState(null);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { alertId } = useParams();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    function onConnect() {
      setIsConnected(true);
      console.log('Guardian connected to WebSocket server!');
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
    socket.on('alert-resolved', onAlertResolved);


    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new-location', onNewLocation);

    onConnect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new-location', onNewLocation);
    };
  }, [alertId]);

  return (
    <div>
      <h1>Live Tracking for Alert</h1>
      <p>Status: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <p>Alert ID: {alertId}</p>
      
      {location 
        ? <Map position={location} />
        : <p>Waiting for the first location update...</p>
      }
    </div>
  );
};

export default GuardianView;