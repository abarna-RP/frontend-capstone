import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function VideoCall() {
  const [meetLink, setMeetLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const createMeet = async () => {
    if (!email) {
      alert('Please enter an email');
      return;
    }

    try {
      setLoading(true);
      const summary = 'Online Meeting';
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + 30 * 60000); // 30 minutes

      const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/create-meet`, {
        params: {
          summary,
          startTime,
          endTime,
          attendeeEmail: email,
        },
      });


      setMeetLink(data.meetLink);
    } catch (error) {
      console.error('Error creating Google Meet link:', error);
      alert('Failed to create meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-4">Google Meet Integration</h2>
      <input
        type="email"
        placeholder="Enter attendee email"
        className="form-control mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn btn-primary" onClick={createMeet} disabled={loading}>
        {loading ? 'Creating Meeting...' : 'Create Google Meet'}
      </button>

      {meetLink && (
        <div className="mt-4">
          <p>Meeting created successfully!</p>
          <a href={meetLink} target="_blank" rel="noopener noreferrer" className="btn btn-success">
            Join Google Meet
          </a>
        </div>
      )}
    </div>
  );
}

export default VideoCall;