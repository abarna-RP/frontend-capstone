import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function Appointment() {
  const { counselorId } = useParams();
  const [date, setDate] = useState('');
  const [sessionType, setSessionType] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

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
          date: date,
          sessionType: sessionType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate('/client'), 2000); // 2 வினாடிகளுக்குப் பிறகு திருப்பி விடவும்
    } catch (apiError) {
      console.error('Error booking appointment:', apiError);
      setError(apiError.response?.data?.error || 'Failed to book appointment. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return <div className="p-4">Appointment booked successfully!</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
            Date and Time:
          </label>
          <input
            type="datetime-local"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sessionType">
            Session Type:
          </label>
          <input
            type="text"
            id="sessionType"
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Book
        </button>
      </form>
    </div>
  );
}

export default Appointment;