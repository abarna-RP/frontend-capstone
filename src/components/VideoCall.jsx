import React, { useState, useEffect, useRef, useCallback } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
    return <div className="p-4">Loading video call...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-yellow-100 rounded whitespace-pre-wrap">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Video Call</h2>
      <div className="flex flex-wrap gap-4">
        <div className="relative">
          <div ref={localVideoRef} className="w-64 h-48 bg-black rounded-lg"></div>
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
            You (UID: {uid})
          </div>
        </div>

        {remoteUsers.map((user) => (
          <div key={user.uid} className="relative">
            <div
              ref={(el) => (remoteVideoRefs.current[user.uid] = el)}
              className="w-64 h-48 bg-black rounded-lg"
            ></div>
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
              User {user.uid}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VideoCall;

