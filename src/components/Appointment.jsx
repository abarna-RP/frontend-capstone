// frontend/src/components/Appointment.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

function Appointment() {
  const { counselorId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [minDate, setMinDate] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const now = new Date();
    const formatted = format(now, "yyyy-MM-dd'T'HH:mm");
    setMinDate(formatted);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!date || !sessionType) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (sessionType.length > 500) {
      setError('Session type must be less than 500 characters.');
      setLoading(false);
      return;
    }

    const selectedDate = new Date(date);
    const now = new Date();
    if (selectedDate < now) {
      setError('Please select a future date and time.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        setError('Login required.');
        setLoading(false);
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/appointments`,
        {
          client: userId,
          counselor: counselorId,
          date,
          sessionType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate('/myappointments'), 2000);
    } catch (apiError) {
      console.error('Error booking appointment:', apiError);
      setError(apiError.response?.data?.error || 'Failed to book appointment. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mt-4">
        <div className="alert alert-success text-center" role="alert">
          Appointment booked successfully! Redirecting...
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Book Appointment</h2>

      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {loading && (
        <div className="text-center mb-3">
          <div className="spinner-border" role="status"></div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
        <div className="mb-3">
          <label htmlFor="date" className="form-label">Date and Time:</label>
          <input
            type="datetime-local"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="form-control"
            required
            min={minDate}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="sessionType" className="form-label">Session Type:</label>
          <input
            type="text"
            id="sessionType"
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
            className="form-control"
            maxLength={500}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">Book Appointment</button>
      </form>
    </div>
  );
}

export default Appointment;
