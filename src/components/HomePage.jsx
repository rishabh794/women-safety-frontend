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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Your Safety Dashboard
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome, <span className="text-purple-600">{user?.name}</span>!
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take control of your security with our comprehensive safety platform. 
            Your safety is our priority.
          </p>
        </div>

        {/* Main Action Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            {/* SOS Control Panel */}
            <div className="p-8 md:p-12 text-center">
              <div className="mb-8">
                <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                  isTracking 
                    ? 'bg-red-100 border-4 border-red-200 animate-pulse' 
                    : 'bg-purple-100 border-4 border-purple-200'
                }`}>
                  <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                    isTracking ? 'bg-red-500' : 'bg-purple-600'
                  }`}>
                    {isTracking ? (
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                    ) : (
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${
                  isTracking ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {isTracking ? 'SOS Active - You\'re Protected' : 'Emergency SOS System'}
                </h2>
                
                <p className={`text-lg mb-8 ${
                  isTracking ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {isTracking 
                    ? 'Your location is being tracked and shared with your guardians'
                    : 'Press the button below to activate emergency tracking and alerts'
                  }
                </p>
              </div>

              {!isTracking ? (
                <button 
                  onClick={startTracking}
                  className="group relative inline-flex items-center justify-center px-12 py-4 text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl hover:from-purple-700 hover:to-purple-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-6 h-6 mr-3 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  START SOS
                </button>
              ) : (
                <button 
                  onClick={stopTracking}
                  className="group relative inline-flex items-center justify-center px-12 py-4 text-xl font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  STOP SOS
                </button>
              )}
            </div>

            {/* Active Tracking Section */}
            {isTracking && location && (
              <div className="border-t border-gray-100">
                <div className="p-8 md:p-12">
                  <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center gap-3 bg-green-100 text-green-700 px-6 py-3 rounded-full">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                      <span className="font-semibold">Live Tracking Active</span>
                    </div>
                  </div>
                  
                  {/* Map Container */}
                  <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Your Current Location</h3>
                    <div className="rounded-xl overflow-hidden shadow-lg">
                      <Map position={location} />
                    </div>
                  </div>

                  {/* Action Cards */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Share Link Card */}
                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-gray-900">Guardian Link</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Share this secure tracking link with your guardian:
                      </p>
                      <div className="bg-white border border-purple-200 rounded-lg p-3 text-sm font-mono text-purple-700 break-all">
                        {`${window.location.origin}/track/${alertData?.id}`}
                      </div>
                    </div>

                    {/* Google Maps Card */}
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-gray-900">External Maps</h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Open your location in Google Maps for detailed navigation:
                      </p>
                      <a 
                        href={googleMapsUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Open Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Cards - Always Visible */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Emergency SOS */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors duration-300">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Emergency SOS</h3>
            <p className="text-gray-600">Instant alert system for emergency situations with one-tap activation</p>
          </div>

          {/* Live Location */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors duration-300">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Live Location</h3>
            <p className="text-gray-600">Real-time tracking that keeps your guardians informed of your whereabouts</p>
          </div>

          {/* Guardian Network */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center group hover:shadow-xl transition-all duration-300">
            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-pink-200 transition-colors duration-300">
              <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Guardian Network</h3>
            <p className="text-gray-600">Connected support system that activates when you need help most</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;