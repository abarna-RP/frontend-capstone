import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Counselor() {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!userId || !token) {
          setError('Login required.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/appointments/counselor/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAppointments(response.data);
      } catch (apiError) {
        console.error('Error fetching appointments:', apiError);
        setError(apiError.response?.data?.error || 'Failed to fetch appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Counselor Dashboard</h2>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        appointments.map((appointment) => (
          <div key={appointment._id} className="border p-2 mb-2">
            <p>Client: {appointment.client?.name || 'Unknown Client'}</p>
            <p>Date: {new Date(appointment.date).toLocaleString()}</p>
            <p>Session Type: {appointment.sessionType}</p>
            <button onClick={() => navigate(`/video-call/${appointment._id}/${localStorage.getItem('userId')}`)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Join Video Call</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Counselor;