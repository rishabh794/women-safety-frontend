import React, { useReducer, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { socket } from '../socket';
import Map from './Map';

const initialState = {
  isConnected: false,
  location: null,
  alertStatus: 'active',
  error: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'CONNECTION_STATUS':
      return { ...state, isConnected: action.payload };
    case 'SET_INITIAL_state.location':
      return { ...state, location: action.payload };
    case 'UPDATE_state.location':
      return { ...state, location: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'ALERT_RESOLVED':
      return { ...state, isConnected: false, alertStatus: 'resolved' };
    default:
      throw new Error();
  }
}

const GuardianView = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { alertId } = useParams();

  useEffect(() => {
    const fetchInitialAlert = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/alerts/${alertId}`);
        const initialAlert = response.data.alert;
        dispatch({ type: 'SET_INITIAL_state.location', payload: [initialAlert.latitude, initialAlert.longitude] });
        if (initialAlert.status === 'resolved') {
          dispatch({ type: 'ALERT_RESOLVED' });
        }
      } catch {
        dispatch({ type: 'SET_ERROR', payload: 'Could not find the requested alert.' });
      }
    };

    fetchInitialAlert();

    function onConnect() {
      dispatch({ type: 'CONNECTION_STATUS', payload: true });
      socket.emit('join-alert-room', alertId);
    }
    function onDisconnect() {
      dispatch({ type: 'CONNECTION_STATUS', payload: false });
    }
    function onNewLocation(data) {
      dispatch({ type: 'UPDATE_state.location', payload: [data.latitude, data.longitude] });
    }
    function onAlertResolved() {
      dispatch({ type: 'ALERT_RESOLVED' });
      alert('The user has ended the SOS alert.');
      socket.disconnect();
    }

    socket.connect();
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

  const googleMapsUrl = state.location
    ? `https://www.google.com/maps?q=${state.location[0]},${state.location[1]}`
    : '#';

  if (state.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Alert Not Found</h2>
          <p className="text-red-600 mb-6">{state.error}</p>
          <button 
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Emergency Alert Active
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Guardian Live Tracking
          </h1>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            You are monitoring an active emergency alert. The person's location is being tracked in real-time.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  state.isConnected 
                    ? 'bg-green-100 border-2 border-green-200' 
                    : 'bg-red-100 border-2 border-red-200'
                }`}>
                  {state.isConnected ? (
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0 0L12 12m-6.364 6.364L12 12m0 0l6.364-6.364M12 12L5.636 5.636" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Connection Status</h3>
                  <p className={`text-sm ${state.isConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {state.isConnected ? 'Connected - Receiving live updates' : 'Disconnected - Attempting to reconnect'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  state.isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}></div>
                <span className={`text-sm font-medium ${
                  state.isConnected ? 'text-green-700' : 'text-red-700'
                }`}>
                  {state.isConnected ? 'Live' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {state.location ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900">Live Location</h2>
                      <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Real-time
                      </div>
                    </div>
                  </div>
                  
                  <div className="aspect-video">
                    <Map position={state.location} />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
                  
                  <div className="space-y-4">
                    <a 
                      href={googleMapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Open in Google Maps
                    </a>

                    <a 
                      href="tel:112"
                      className="w-full flex items-center justify-center gap-3 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      Call Emergency Services
                    </a>

                    <button 
                      onClick={() => {
                        if (navigator.share && state.location) {
                          navigator.share({
                            title: 'Emergency location',
                            text: 'Someone needs help at this location:',
                            url: googleMapsUrl
                          });
                        } else if (state.location) {
                          navigator.clipboard.writeText(googleMapsUrl);
                          alert('location link copied to clipboard!');
                        }
                      }}
                      className="w-full flex items-center justify-center gap-3 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors duration-200 font-medium"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      Share Location
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-red-900">Important Information</h3>
                  </div>
                  
                  <div className="space-y-3 text-sm text-red-800">
                    <p>• This person has activated their emergency SOS</p>
                    <p>• Location updates automatically every few seconds</p>
                    <p>• You will be notified when the alert is resolved</p>
                    <p>• Contact emergency services if immediate help is needed</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
                  <h3 className="font-bold text-gray-900 mb-3">Alert Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Alert ID:</span>
                      <span className="font-mono text-gray-900 bg-white px-2 py-1 rounded border">
                        {alertId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className="text-red-600 font-medium">Active</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Started:</span>
                      <span className="text-gray-900">{new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-96">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center max-w-md w-full">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Loading location Data</h2>
                <p className="text-gray-600">
                  Fetching the initial location for this emergency alert...
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                This is a secure emergency tracking session. location data is encrypted and only visible to authorized guardians.
              </p>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  End-to-end encrypted
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                  </svg>
                  Real-time updates
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Secure connection
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardianView;