// frontend/src/components/VideoCall.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function VideoCall() {
  const { channelName, uid } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRefs = useRef({});
  const clientRef = useRef(AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' }));
  const tracksRef = useRef({ audio: null, video: null });
  const [remoteUsers, setRemoteUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleUserPublished = useCallback(async (user, mediaType) => {
    try {
      await clientRef.current.subscribe(user, mediaType);
      if (mediaType === 'video' && remoteVideoRefs.current[user.uid]) {
        user.videoTrack.play(remoteVideoRefs.current[user.uid]);
      }
      if (mediaType === 'audio') {
        user.audioTrack.play();
      }
      setRemoteUsers((prevUsers) => [...prevUsers, user]);
    } catch (apiError) {
      console.error('Error handling user published:', apiError);
      setError('Failed to handle user published.');
    }
  }, []);

  const handleUserUnpublished = useCallback((user) => {
    setRemoteUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
  }, []);

  useEffect(() => {
    const client = clientRef.current;
    let mounted = true;

    const startVideoCall = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError('Your browser does not support media devices.');
          setLoading(false);
          return;
        }

        const tokenResponse = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/video-token?channelName=${channelName}&uid=${uid}`
        );
        const agoratoken = tokenResponse.data.token;

        if (!agoratoken) {
          setError('Invalid token received from server.');
          setLoading(false);
          return;
        }

        let audioTrack, videoTrack;
        try {
          [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        } catch (err) {
          console.error('Permission error:', err);
          if (err.name === 'NotAllowedError' || err.message.includes('Permission denied')) {
            setError(
              '🎙️ Please allow access to your camera and microphone.\n\n👉 Tip: If you blocked it earlier, go to browser > Site settings > Permissions > Allow mic & camera for this site.'
            );
          } else {
            setError('Could not access microphone or camera.');
          }
          setLoading(false);
          return;
        }

        if (!mounted) return;

        tracksRef.current = { audio: audioTrack, video: videoTrack };

        await client.join(import.meta.env.VITE_AGORA_APP_ID, channelName, agoratoken, parseInt(uid));
        await client.publish([audioTrack, videoTrack]);

        if (localVideoRef.current) {
          videoTrack.play(localVideoRef.current);
        }

        client.on('user-published', handleUserPublished);
        client.on('user-unpublished', handleUserUnpublished);

        setLoading(false);
      } catch (apiError) {
        console.error('Error starting video call:', apiError);
        setError('Failed to start video call. Please check your network and try again.');
        setLoading(false);
      }
    };

    startVideoCall();

    return () => {
      mounted = false;
      const cleanup = async () => {
        try {
          client.off('user-published', handleUserPublished);
          client.off('user-unpublished', handleUserUnpublished);

          if (tracksRef.current.video) {
            tracksRef.current.video.stop();
            tracksRef.current.video.close();
          }
          if (tracksRef.current.audio) {
            tracksRef.current.audio.stop();
            tracksRef.current.audio.close();
          }

          await client.leave();
          setRemoteUsers([]);
        } catch (apiError) {
          console.error('Cleanup error:', apiError);
        }
      };
      cleanup();
    };
  }, [channelName, uid, handleUserPublished, handleUserUnpublished]);

  if (loading) {
    return <div className="container mt-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  }

  if (error) {
    return (
      <div className="container mt-5 alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Video Call</h2>
      <div className="row g-3">
        <div className="col-md-6">
          <div className="position-relative">
            <div ref={localVideoRef} className="bg-black rounded-lg ratio ratio-4x3"></div>
            <div className="position-absolute bottom-0 start-0 bg-dark bg-opacity-50 text-white p-2 rounded-sm">
              You (UID: {uid})
            </div>
          </div>
        </div>

        {remoteUsers.map((user) => (
          <div key={user.uid} className="col-md-6">
            <div className="position-relative">
              <div
                ref={(el) => (remoteVideoRefs.current[user.uid] = el)}
                className="bg-black rounded-lg ratio ratio-4x3"
              ></div>
              <div className="position-absolute bottom-0 start-0 bg-dark bg-opacity-50 text-white p-2 rounded-sm">
                User {user.uid}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoCall;