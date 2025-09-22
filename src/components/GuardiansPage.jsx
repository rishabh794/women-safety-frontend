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
        const response = await axios.get('http://localhost:3000/api/guardians', {
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
      const response = await axios.post('http://localhost:3000/api/guardians', 
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
      await axios.delete(`http://localhost:3000/api/guardians/${guardianId}`, {
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
      const response = await axios.put(`http://localhost:3000/api/guardians/${guardianId}`, 
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGuardians(guardians.map(g => (g.id === guardianId ? response.data.guardian : g)));
      setEditingGuardianId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update guardian.');
    }
  };

  if (loading) return <div>Loading guardians...</div>;

  return (
    <div>
      <h2>Manage Your Guardians</h2>
      <h3>Add a New Guardian</h3>
      <form onSubmit={handleAddGuardian}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Guardian's Name" required />
        <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Guardian's Phone Number" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email (Optional)" />
        <button type="submit">Add Guardian</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <hr />
      <h3>Your Guardians ({guardians.length}/3)</h3>
      <div>
        {guardians.map((guardian) => (
          <div key={guardian.id} style={{ border: '1px solid grey', padding: '10px', margin: '10px' }}>
            {editingGuardianId === guardian.id ? (
              <EditGuardianForm 
                guardian={guardian} 
                onSave={handleUpdateGuardian} 
                onCancel={() => setEditingGuardianId(null)}
              />
            ) : (
              <div>
                <p><strong>Name:</strong> {guardian.name}</p>
                <p><strong>Phone:</strong> {guardian.phoneNumber}</p>
                <p><strong>Email:</strong> {guardian.email}</p>
                <button onClick={() => setEditingGuardianId(guardian.id)}>Edit</button>
                <button onClick={() => handleDeleteGuardian(guardian.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuardiansPage;