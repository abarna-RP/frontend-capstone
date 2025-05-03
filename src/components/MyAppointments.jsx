import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!userId || !token) {
          setError('Please login to view appointments.');
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/appointments/client/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAppointments(res.data);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err.response?.data?.error || 'Failed to fetch appointments.');
      } finally {
        setLoading(false);
      }
    };

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
      setAppointments((prev) =>
        prev.filter((appointment) => appointment._id !== appointmentId)
      );
    } catch (err) {
      console.error('Error canceling appointment:', err);
      alert('Failed to cancel appointment. Try again.');
    }
  };

  if (loading) return <div className="text-center mt-5">Loading appointments...</div>;

  return (
    <div className="container py-4">
      <h3 className="mb-4 text-primary">My Appointments</h3>

      {error && <div className="alert alert-danger">{error}</div>}

      {appointments.length === 0 ? (
        <p className="text-muted">No appointments found.</p>
      ) : (
        <div className="row">
          {appointments.map((appointment) => (
            <div key={appointment._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-dark">
                    {appointment.counselor?.name || 'Unknown Counselor'}
                  </h5>
                  <p className="card-text mb-1">
                    <strong>Date:</strong>{' '}
                    {format(new Date(appointment.date), 'yyyy-MM-dd hh:mm a')}
                  </p>
                  <p className="card-text mb-3">
                    <strong>Session Type:</strong> {appointment.sessionType}
                  </p>

                  <div className="d-grid gap-2">
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
                      className="btn btn-outline-danger"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() =>
                        navigate(`/video-call/${appointment._id}/${localStorage.getItem('userId')}`)
                      }
                      className="btn btn-primary"
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
};

export default MyAppointments;
