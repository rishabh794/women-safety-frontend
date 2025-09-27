import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from './auth-context';
import { socket } from '../socket';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [alertData, setAlertData] = useState(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/user`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user);
        } catch{
          localStorage.removeItem('authToken');
          setUser(null);
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    socket.connect();
    if (alertData) {
      socket.emit('join-alert-room', alertData.id);
    }
    return () => {
      socket.disconnect();
    };
  }, [alertData]);

  const login = async (email, password) => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/login`, {
      email,
      password,
    });
    localStorage.setItem('authToken', response.data.token);
    setUser(response.data.user);
    return response.data.user;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  const startTracking = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const getLocation = () =>
        new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
          });
        });

      const position = await getLocation();
      const { latitude, longitude } = position.coords;
      setLocation([latitude, longitude]);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/alerts`,
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
        () => {
          stopTracking();
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );
      setIsTracking(true);
    } catch (error) {
      alert(`Could not start SOS: ${error.message}`);
    }
  };

  const stopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (alertData) {
      socket.emit('stop-tracking', { alertId: alertData.id });
    }
    setIsTracking(false);
    setAlertData(null);
    setLocation(null);
  };

  const authContextValue = {
    user,
    login,
    logout,
    loading,
    isTracking,
    location,
    alertData,
    startTracking,
    stopTracking,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
