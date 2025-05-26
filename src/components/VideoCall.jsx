import React, { useState } from 'react';
import axios from 'axios';

function VideoCall() {
  // const [meetLink, setMeetLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const createMeet = async () => {
    if (!email) {
      alert('Please enter an email');
      return;
    }

    try {
      setLoading(true);
      // Your backend currently creates a static event on oauth2callback,
      // so here just redirect the user to your backend root URL for login
      // Or you can create a dedicated endpoint for dynamic event creation.

      // For now, let's call your root endpoint to get login URL
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/`);
      // Redirect user to the Google OAuth login
      window.location.href = response.data.match(/href="([^"]*)"/)[1]; 
      // Once user authenticates, your backend creates the Meet event and sends the link.

    } catch (error) {
      console.error('Error initiating login:', error);
      alert('Failed to start Google login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <h2 className="text-3xl font-semibold mb-8 text-gray-800">Google Meet Integration</h2>

      <input
        type="email"
        placeholder="Enter attendee email"
        className="w-full max-w-md p-3 mb-6 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={createMeet}
        disabled={loading}
        className={`w-full max-w-md py-3 rounded-md text-white font-medium ${
          loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Starting Google Login...' : 'Create Google Meet'}
      </button>

      
    </div>
  );
}

export default VideoCall;