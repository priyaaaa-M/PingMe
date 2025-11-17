import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";

import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  useCallStateHooks,
  ParticipantView,
  useCall,
} from '@stream-io/video-react-sdk';

import "@stream-io/video-react-sdk/dist/css/styles.css";




import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

// Custom layout component for resizable videos
const ResizableVideoLayout = () => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const [draggingId, setDraggingId] = useState(null);
  const [sizes, setSizes] = useState({});
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (participantId, e) => {
    setDraggingId(participantId);
    dragOffset.current = {
      x: e.clientX,
      y: e.clientY,
    };
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!draggingId) return;

    const deltaX = e.clientX - dragOffset.current.x;
    const deltaY = e.clientY - dragOffset.current.y;

    setSizes(prev => ({
      ...prev,
      [draggingId]: {
        width: Math.max(200, (prev[draggingId]?.width || 300) + deltaX),
        height: Math.max(150, (prev[draggingId]?.height || 200) + deltaY),
      }
    }));

    dragOffset.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  useEffect(() => {
    if (draggingId) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggingId]);

  if (participants.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center text-white">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
            <span className="text-2xl">📹</span>
          </div>
          <p className="text-xl font-semibold">Waiting for participants to join...</p>
          <p className="text-gray-400 mt-2">You're the first one here</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-full bg-gradient-to-br from-gray-900 to-black p-4 overflow-auto"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-7xl mx-auto">
        {participants.map((participant) => {
          const size = sizes[participant.sessionId] || { width: 400, height: 300 };
          
          return (
            <div
              key={participant.sessionId}
              className="relative group bg-gray-800 rounded-2xl overflow-hidden border-2 border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 shadow-2xl"
              style={{
                width: size.width,
                height: size.height,
                minWidth: '300px',
                minHeight: '200px',
              }}
            >
              {/* Resize handle */}
              <div
                className="absolute bottom-2 right-2 w-6 h-6 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
                onMouseDown={(e) => handleMouseDown(participant.sessionId, e)}
              >
                <div className="w-full h-full flex items-end justify-end">
                  <div className="w-3 h-3 border-b-2 border-r-2 border-emerald-400"></div>
                </div>
              </div>

              {/* Participant video */}
              <div className="w-full h-full">
                <ParticipantView
                  participant={participant}
                  style={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>

              {/* Participant name overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-3">
                  {participant.image && (
                    <img
                      src={participant.image}
                      alt={participant.name}
                      className="w-8 h-8 rounded-full border-2 border-emerald-400"
                    />
                  )}
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {participant.name || 'Unknown User'}
                    </p>
                    <p className="text-emerald-300 text-xs">
                      {participant.isSpeaking && '🎤 Speaking'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Connection status */}
              {participant.connectionQuality && (
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    participant.connectionQuality === 'excellent' ? 'bg-green-500' :
                    participant.connectionQuality === 'good' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                    {participant.connectionQuality}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating participant count */}
      
    </div>
  );
};

const CallPage = () => {
  const { id: callId } = useParams();
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const navigate = useNavigate();

  const { authUser, isLoading } = useAuthUser();
  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  });

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return;

      try {
        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePic,
        };

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });

        const callInstance = videoClient.call("default", callId);
        await callInstance.join({ create: true });

        setClient(videoClient);
        setCall(callInstance);
      } catch (error) {
        console.error("Error joining call:", error);
        toast.error("Could not join the call. Please try again.");
      } finally {
        setIsConnecting(false);
      }
    };

    initCall();

    return () => {
      if (call) {
        call.leave().catch(console.error);
      }
      if (client) {
        client.disconnectUser();
      }
    };
  }, [tokenData, authUser, callId]);

  if (isLoading || isConnecting) return <PageLoader />;

  if (!client || !call) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center text-white p-8 rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-red-500/30">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Call Failed</h2>
          <p className="text-gray-300">Could not initialize call. Please refresh or try again later.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-full text-white font-semibold transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <StreamTheme className="custom-video-theme">
          <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-emerald-500/20 bg-black/30 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white font-semibold">Live Call</span>
                <div className="text-emerald-300 text-sm">
                  <ParticipantNames />
                </div>
              </div>
              <div className="text-gray-400 text-sm">
                {new Date().toLocaleTimeString()}
              </div>
            </div>

            {/* Video Area */}
            <div className="flex-1 overflow-hidden">
              <ResizableVideoLayout />
            </div>

            {/* Controls */}
            <div className="p-6 border-t border-emerald-500/20 bg-black/40 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto">
                <CallControls 
                  onLeave={() => {
                    toast.success("Left the call");
                    navigate("/");
                  }} 
                />
              </div>
            </div>
          </div>
        </StreamTheme>
      </StreamCall>
    </StreamVideo>
  );
};

// Component to display participant names
const ParticipantNames = () => {
  const call = useCall();
  const { useParticipantCount, useRemoteParticipants } = useCallStateHooks();
  const participantCount = useParticipantCount();
  const remoteParticipants = useRemoteParticipants();
  
  if (!call || !participantCount) return null;
  
  // Get all participant names, excluding the local user
  const participantNames = remoteParticipants
    .map(p => p.name || 'Participant')
    .join(', ');

  return (
    <span>
      {participantCount === 1 
        ? 'Waiting for others to join...' 
        : `In call with: ${participantNames}`}
    </span>
  );
};

export default CallPage;