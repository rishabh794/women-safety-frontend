import React from 'react';
import Map from './Map';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
  const { 
    user, 
    isTracking, 
    location, 
    alertData, 
    startTracking, 
    stopTracking 
  } = useAuth();

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
          <p>Share this link with your guardian: {`${window.location.origin}/track/${alertData?.id}`}</p>
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
            Open in Google Maps
          </a>
        </div>
      )}
    </div>
  );
};

export default HomePage;