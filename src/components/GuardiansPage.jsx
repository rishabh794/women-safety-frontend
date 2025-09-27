import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import EditGuardianForm from './EditGuardianForm';

const GuardiansPage = () => {
  const [guardians, setGuardians] = useState([]);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingGuardianId, setEditingGuardianId] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGuardians = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('${import.meta.env.VITE_API_BASE_URL}/guardians', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGuardians(response.data.guardians);
      } catch (err) {
        setError('Failed to fetch guardians.',err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchGuardians();
    }
  }, [user]);

  const handleAddGuardian = async (e) => {
    e.preventDefault();
    if (guardians.length >= 3) {
      setError('You can only have a maximum of 3 guardians.');
      return;
    }
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('${import.meta.env.VITE_API_BASE_URL}/guardians', 
        { name, phoneNumber, email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGuardians([...guardians, response.data.guardian]);
      setName('');
      setPhoneNumber('');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add guardian.');
    }
  };

  const handleDeleteGuardian = async (guardianId) => {
    if (!window.confirm('Are you sure you want to delete this guardian?')) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/guardians/${guardianId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuardians(guardians.filter(g => g.id !== guardianId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete guardian.');
    }
  };

  const handleUpdateGuardian = async (guardianId, updatedData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/guardians/${guardianId}`, 
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGuardians(guardians.map(g => (g.id === guardianId ? response.data.guardian : g)));
      setEditingGuardianId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update guardian.');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg">Loading guardians...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Manage Your <span className="text-purple-600">Guardians</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Add up to 3 trusted guardians who will receive SMS alerts when you activate the emergency SOS system.
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold">Emergency SOS Alerts</h3>
          </div>
          <p className="text-white/90 leading-relaxed">
            When you activate the SOS system, all your guardians will instantly receive SMS messages with your location 
            and emergency status. Make sure to add trusted contacts who can respond quickly in case of an emergency.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-purple-100">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Add a New Guardian</h3>
          </div>
          
          <form onSubmit={handleAddGuardian} className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Guardian's Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Guardian's Name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Guardian's Phone Number"
                  required
                  pattern="\+[1-9]\d{10,14}"
                  title="Phone number must be in international format, e.g., +919876543210"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (Optional)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={guardians.length >= 3}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {guardians.length >= 3 ? 'Maximum Guardians Reached' : 'Add Guardian'}
            </button>
          </form>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">Your Guardians ({guardians.length}/3)</h3>
            </div>
            <p className="text-purple-100 mt-2">
              These trusted contacts will be notified during emergencies
            </p>
          </div>
          
          <div className="p-6">
            {guardians.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Guardians Added Yet</h3>
                <p className="text-gray-600">Add your first guardian to start building your safety network.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {guardians.map((guardian) => (
                  <div key={guardian.id} className="bg-gradient-to-r from-gray-50 to-purple-50 rounded-xl p-6 border border-purple-100">
                    {editingGuardianId === guardian.id ? (
                      <EditGuardianForm 
                        guardian={guardian} 
                        onSave={handleUpdateGuardian} 
                        onCancel={() => setEditingGuardianId(null)}
                      />
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {guardian.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          
                          <div>
                            <p className="text-xl font-bold text-gray-900 mb-1">
                              <strong>Name:</strong> {guardian.name}
                            </p>
                            <p className="flex items-center text-gray-600 mb-1">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <strong>Phone:</strong> {guardian.phoneNumber}
                            </p>
                            <p className="flex items-center text-gray-600">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                              <strong>Email:</strong> {guardian.email}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={() => setEditingGuardianId(guardian.id)}
                            className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          
                          <button
                            onClick={() => handleDeleteGuardian(guardian.id)}
                            className="flex items-center px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors duration-200"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardiansPage;