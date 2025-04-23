import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [preferences, setPreferences] = useState('');
  const [sessionRate, setSessionRate] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSuccessMessage(null);

    if (!username || !email || !password || !name) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
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
        data.specialization = specialization.split(',').map(s => s.trim());
        data.sessionRate = parseFloat(sessionRate);
        if (isNaN(data.sessionRate)) {
          setError('Session rate must be a valid number.');
          setLoading(false);
          return;
        }
      } else {
        data.preferences = preferences.split(',').map(p => p.trim());
      }

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, data);
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (apiError) {
      console.error('Registration failed:', apiError);
      setError(apiError.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/lll.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="col-md-6 p-2 rounded shadow"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
      >
        <h2 className="mt-4 text-center">Register</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}

        <div className="mb-2">
          <label className="form-label">Username:</label>
          <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>

        <div className="mb-2">
          <label className="form-label">Email:</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="mb-2">
          <label className="form-label">Password:</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <small className="form-text text-muted">Must be at least 6 characters long.</small>
        </div>

        <div className="mb-2">
          <label className="form-label">Role:</label>
          <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="client">Client</option>
            <option value="counselor">Counselor</option>
          </select>
        </div>

        <div className="mb-2">
          <label className="form-label">Name:</label>
          <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        {role === 'counselor' && (
          <>
            <div className="mb-2">
              <label className="form-label">Specialization (comma-separated):</label>
              <input type="text" className="form-control" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required />
            </div>
            <div className="mb-2">
              <label className="form-label">Session Rate:</label>
              <input type="number" className="form-control" value={sessionRate} onChange={(e) => setSessionRate(e.target.value)} required />
            </div>
          </>
        )}

        {role === 'client' && (
          <div className="mb-2">
            <label className="form-label">Preferences (comma-separated):</label>
            <input type="text" className="form-control" value={preferences} onChange={(e) => setPreferences(e.target.value)} required />
          </div>
        )}

        <button type="submit" className="btn btn-success w-100" disabled={loading}>Register</button>

        <p className="mt-1 text-center text-muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
