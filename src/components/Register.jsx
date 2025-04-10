import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [preferences, setPreferences] = useState('');
  const [sessionRate, setSessionRate] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!username || !email || !password || !name) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (role === 'counselor' && !specialization) {
      setError('Please enter specialization.');
      setLoading(false);
      return;
    }

    if (role === 'client' && !preferences) {
      setError('Please enter preferences.');
      setLoading(false);
      return;
    }

    try {
      const data = { username, email, password, role, name };
      if (role === 'counselor') {
        data.specialization = specialization.split(',');
        data.sessionRate = sessionRate;
      } else {
        data.preferences = preferences.split(',');
      }
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('userId', response.data.userId); // Add this line
      navigate(response.data.role === 'counselor' ? '/counselor' : '/client');
    } catch (apiError) {
      console.error('Registration failed:', apiError);
      setError(apiError.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center h-screen">
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}
      <label htmlFor="username">Username:</label>
      <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" className="border p-2 mb-2" />
      <label htmlFor="email">Email:</label>
      <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-2 mb-2" />
      <label htmlFor="password">Password:</label>
      <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border p-2 mb-2" />
      <label htmlFor="role">Role:</label>
      <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 mb-2">
        <option value="client">Client</option>
        <option value="counselor">Counselor</option>
      </select>
      <label htmlFor="name">Name:</label>
      <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="border p-2 mb-2" />
      {role === 'counselor' && (
        <>
          <label htmlFor="specialization">Specialization (comma-separated):</label>
          <input type="text" id="specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Specialization (comma-separated)" className="border p-2 mb-2" />
          <label htmlFor="sessionRate">Session Rate:</label>
          <input type="number" id="sessionRate" value={sessionRate} onChange={(e) => setSessionRate(e.target.value)} placeholder="Session Rate" className="border p-2 mb-2" />
        </>
      )}
      {role === 'client' && (
        <>
          <label htmlFor="preferences">Preferences (comma-separated):</label>
          <input type="text" id="preferences" value={preferences} onChange={(e) => setPreferences(e.target.value)} placeholder="Preferences (comma-separated)" className="border p-2 mb-2" />
        </>
      )}
      <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Register</button>
    </form>
  );
}

export default Register;