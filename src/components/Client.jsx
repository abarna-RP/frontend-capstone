import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';

function Client() {
  const [counselors, setCounselors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/appointments/client/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/appointments/${appointmentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(appointments.filter((appt) => appt._id !== appointmentId));
    } catch (apiError) {
      console.error('Error cancelling appointment:', apiError);
      setError(apiError.response?.data?.error || 'Failed to cancel appointment.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-6">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded max-w-md mx-auto mt-6 text-center shadow">
        {error}
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-6xl mx-auto mb-8">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Client Dashboard</h2>

      <h3 className="text-2xl font-semibold mb-4 text-gray-700">Available Counselors</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {counselors.map((counselor) => (
          <div
            key={counselor._id}
            className="bg-white shadow-md hover:shadow-xl transition duration-300 rounded-xl p-6 border border-gray-100"
          >
            <h5 className="text-xl font-semibold mb-2 text-gray-800">{counselor.name}</h5>
            <p className="text-gray-600 mb-4">
              Specialization:{' '}
              <span className="text-gray-800 font-medium">
                {counselor.specialization?.join(', ') || 'N/A'}
              </span>
            </p>
            <button
              onClick={() => navigate(`/appointment-booking/${counselor._id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full transition duration-300"
            >
              Book Appointment
            </button>
          </div>
        ))}
      </div>

      <h3 className="text-2xl font-semibold mt-10 mb-4 text-gray-700">My Appointments</h3>
      {appointments.length === 0 ? (
        <p className="text-gray-600">No appointments found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white shadow-md hover:shadow-lg transition duration-300 rounded-xl p-6 border border-gray-100"
            >
              <h5 className="text-lg font-semibold mb-2 text-gray-800">
                {appointment.counselor?.name || 'Unknown'}
              </h5>
              <p className="text-gray-600">
                Date:{' '}
                <span className="text-gray-800">
                  {format(new Date(appointment.date), 'yyyy-MM-dd hh:mm a')}
                </span>
              </p>
              <p className="text-gray-600 mb-4">
                Session Type:{' '}
                <span className="text-gray-800">{appointment.sessionType}</span>
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() =>
                    navigate(
                      `/payment/${appointment.client}/${appointment.counselor?.sessionRate}/${appointment.counselor?._id}`
                    )
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                  Pay
                </button>
                <button
                  onClick={() => handleCancelAppointment(appointment._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    navigate(`/video-call/${appointment._id}/${localStorage.getItem('userId')}`)
                  }
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg transition duration-300"
                >
                  Join Video Call
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Client;

