// frontend/src/components/Client.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';

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
      <div className="d-flex justify-content-center mt-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-4 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Client Dashboard</h2>
      <div className="mb-4">
        <Link to="/appointments" className="btn btn-secondary">View All Appointments</Link>
      </div>

      <h3 className="mb-3">Available Counselors:</h3>
      <div className="row">
        {counselors.map((counselor) => (
          <div key={counselor._id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{counselor.name}</h5>
                <p className="card-text">
                  Specialization: {counselor.specialization?.join(', ') || 'N/A'}
                </p>
                <button
                  onClick={() => navigate(`/appointment-booking/${counselor._id}`)}
                  className="btn btn-primary"
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mt-4 mb-3">My Appointments:</h3>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="row">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">
                    {appointment.counselor?.name || 'Unknown'}
                  </h5>
                  <p className="card-text">
                    Date: {format(new Date(appointment.date), 'yyyy-MM-dd hh:mm a')}
                  </p>
                  <p className="card-text">
                    Session Type: {appointment.sessionType}
                  </p>
                  <div className="d-flex flex-column gap-2">
                    <button
                      onClick={() =>
                        navigate(
                          `/payment/${appointment.client}/${appointment.counselor?.sessionRate}/${appointment.counselor?._id}`
                        )
                      }
                      className="btn btn-success"
                    >
                      Pay
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(appointment._id)}
                      className="btn btn-danger"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/video-call/${appointment._id}/${localStorage.getItem('userId')}`)
                      }
                      className="btn btn-info"
                    >
                      Join Video Call
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Client;
