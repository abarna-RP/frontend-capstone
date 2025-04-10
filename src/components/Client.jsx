import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Client() {
  const [counselors, setCounselors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCounselors = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/counselors`);
        setCounselors(response.data);
      } catch (apiError) {
        console.error('Error fetching counselors:', apiError);
        setError(apiError.response?.data?.error || 'Failed to fetch counselors.');
      }
    };

    const fetchAppointments = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!userId || !token) {
          setError('Login required.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/appointments/client/${userId}`, {
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

    fetchCounselors();
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
      <h2 className="text-2xl font-bold mb-4">Client Dashboard</h2>

      <h3 className="text-lg font-semibold mb-2">Available Counselors:</h3>
      {counselors.map((counselor) => (
        <div key={counselor._id} className="border p-2 mb-2">
          <p>Name: {counselor.name}</p>
          <p>Specialization: {counselor.specialization.join(', ')}</p>
          <button onClick={() => navigate(`/appointment-booking/${counselor._id}`)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Book Appointment</button>
        </div>
      ))}

      <h3 className="text-lg font-semibold mb-2 mt-4">My Appointments:</h3>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        appointments.map((appointment) => (
          <div key={appointment._id} className="border p-2 mb-2">
            <p>Counselor: {appointment.counselor.name}</p>
            <p>Date: {new Date(appointment.date).toLocaleString()}</p>
            <p>Session Type: {appointment.sessionType}</p>
            <button onClick={() => navigate(`/payment/${appointment._id}/${appointment.counselor.sessionRate}`)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Pay</button>
            <button onClick={() => navigate(`/video-call/${appointment._id}/${localStorage.getItem('userId')}`)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Join Video Call</button>
          </div>
        ))
      )}
    </div>
  );
}

export default Client;