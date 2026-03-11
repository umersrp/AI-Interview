import React, { useState, useEffect, useRef } from 'react';
import Candidate1 from '@/assets/images/all-img/candidate1.png';
import { Icon } from '@iconify/react';
import DeviceSelector from '@/AiInterviewPages/DeviceSelector/DeviceSelector';

// Debug function to check stream status
const checkStream = (stream, source) => {
  if (!stream) {
    console.log(`[${source}] No stream`);
    return null;
  }
  const info = {
    id: stream.id,
    active: stream.active,
    videoTracks: stream.getVideoTracks().map(t => ({
      kind: t.kind,
      enabled: t.enabled,
      readyState: t.readyState,
      label: t.label,
      id: t.id,
      muted: t.muted
    })),
    audioTracks: stream.getAudioTracks().map(t => ({
      kind: t.kind,
      enabled: t.enabled,
      readyState: t.readyState,
      label: t.label
    }))
  };
  console.log(`[${source}] Stream info:`, info);
  return info;
};

export default function AIInterviewUI() {
  const [currentTime, setCurrentTime] = useState("15:30");
  const [isRecording, setIsRecording] = useState(true);
  const [devicesConfigured, setDevicesConfigured] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const videoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const containerRef = useRef(null);
const mediaStreamRef = useRef(null);
const screenStreamRef = useRef(null);

  // Simulate time update
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(prev => {
        const [min, sec] = prev.split(':').map(Number);
        const newSec = sec + 1 >= 60 ? 0 : sec + 1;
        const newMin = sec + 1 >= 60 ? min + 1 : min;
        return `${newMin.toString().padStart(2, '0')}:${newSec.toString().padStart(2, '0')}`;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Monitor stream status
  useEffect(() => {
    if (!mediaStream) return;
    
    console.log('🔍 Starting stream monitor');
    const interval = setInterval(() => {
      checkStream(mediaStream, 'monitor');
      
      if (videoRef.current) {
        console.log('Video element readyState:', videoRef.current.readyState);
        console.log('Video element error:', videoRef.current.error);
        console.log('Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [mediaStream]);

  // Set up video element when stream is available
  useEffect(() => {
    console.log('🎬 Video useEffect triggered');
    console.log('videoRef.current:', videoRef.current);
    console.log('mediaStream:', mediaStream);
    
    if (videoRef.current && mediaStream) {
      console.log('🎥 Setting video source in interview...');
      checkStream(mediaStream, 'before setting');
      
      // CRITICAL FIX: If stream is not active, we need to recreate it
      if (!mediaStream.active) {
        console.log('⚠️ Stream is not active! Attempting to reactivate...');
        
        // Get the device IDs from the tracks
        const videoTrack = mediaStream.getVideoTracks()[0];
        const audioTrack = mediaStream.getAudioTracks()[0];
        
        if (videoTrack) {
          console.log('Recreating stream with device:', videoTrack.label);
          
          // Request a new stream with the same device
          navigator.mediaDevices.getUserMedia({
            video: { deviceId: { exact: videoTrack.getSettings().deviceId } },
            audio: audioTrack ? { deviceId: { exact: audioTrack.getSettings().deviceId } } : false
          })
          .then(newStream => {
            console.log('✅ New stream created:', newStream);
            setMediaStream(newStream);
          })
          .catch(err => {
            console.error('❌ Failed to recreate stream:', err);
          });
          return;
        }
      }
      
      // Make sure tracks are enabled
      mediaStream.getVideoTracks().forEach(track => {
        track.enabled = true;
        console.log(`Track ${track.id} enabled:`, track.enabled);
      });
      
      // Set the stream
      videoRef.current.srcObject = mediaStream;
      
      // Force a re-render
      videoRef.current.load();
      
      videoRef.current.onloadedmetadata = () => {
        console.log('📹 Video metadata loaded');
        console.log('Video dimensions:', videoRef.current.videoWidth, 'x', videoRef.current.videoHeight);
        
        videoRef.current.play()
          .then(() => {
            console.log('✅ Video playing successfully');
            console.log('Video readyState:', videoRef.current.readyState);
          })
          .catch(e => {
            console.error('❌ Video play error:', e);
            // Try playing again
            setTimeout(() => {
              videoRef.current.play().catch(err => console.error('Retry failed:', err));
            }, 1000);
          });
      };
      
      videoRef.current.onerror = (e) => {
        console.error('❌ Video element error:', e);
      };
      
      videoRef.current.onplaying = () => {
        console.log('🎥 Video is now playing');
      };
    }
  }, [mediaStream]);

  // Handle screen share stream
  useEffect(() => {
    if (screenVideoRef.current && screenStream) {
      screenVideoRef.current.srcObject = screenStream;
      screenVideoRef.current.play().catch(err => console.error('Screen play error:', err));
    }
  }, [screenStream]);

  
// Refs to hold latest streams without causing re-renders

// Keep refs in sync with state
useEffect(() => { mediaStreamRef.current = mediaStream; }, [mediaStream]);
useEffect(() => { screenStreamRef.current = screenStream; }, [screenStream]);

// Cleanup ONLY on unmount — refs avoid stale closure issues
useEffect(() => {
  return () => {
    console.log('🧹 Unmount cleanup');
    mediaStreamRef.current?.getTracks().forEach(t => t.stop());
    screenStreamRef.current?.getTracks().forEach(t => t.stop());
  };
}, []);

// Re-attach camera video after screen sharing stops
useEffect(() => {
  if (!isScreenSharing && videoRef.current && mediaStream) {
    console.log('🔄 Re-attaching camera after screen share stopped');
    videoRef.current.srcObject = mediaStream;
    videoRef.current.play().catch(e => console.error('Re-attach play error:', e));
  }
}, [isScreenSharing]);

  const handleDevicesReady = (stream) => {
    console.log('DEVICES READY CALLED ');
    console.log('Stream received:', stream);
    console.log('Stream active:', stream.active);
    
    if (stream) {
      checkStream(stream, 'handleDevicesReady');
      
      // If stream is not active, we need to fix it
      if (!stream.active) {
        console.log('⚠️ Stream is inactive!');
        
        // Try to get the tracks and enable them
        stream.getVideoTracks().forEach(track => {
          console.log(`Track ${track.id} (${track.label}) enabled:`, track.enabled);
          track.enabled = true;
        });
        
        // If still not active, we'll need to recreate in the useEffect
      }
      
      setMediaStream(stream);
      setDevicesConfigured(true);
    } else {
      console.error('No stream received!');
    }
  };

  const handleEndInterview = () => {
    console.log('Ending interview');
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
      });
      setMediaStream(null);
    }
    if (screenStream) {
      screenStream.getTracks().forEach(track => {
        track.stop();
      });
      setScreenStream(null);
    }
    setIsScreenSharing(false);
    setDevicesConfigured(false);
  };

  const toggleScreenShare = async () => {
  if (isScreenSharing) {
    // Stop screen share only
    if (screenStream) {
      screenStream.getTracks().forEach(track => {
        track.stop();
        console.log('Screen track stopped:', track.kind);
      });
      setScreenStream(null);
    }
    setIsScreenSharing(false);
    console.log('Screen sharing stopped - camera continues');
  } else {
    // Start screen share while preserving camera
    try {
      console.log('Starting screen share - camera will continue');
      
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });
      
      // Log what we got
      console.log('Screen stream obtained:', stream);
      console.log('Screen tracks:', stream.getTracks().length);
      
      // Handle when user stops sharing via browser UI
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        console.log('Screen sharing stopped by browser UI');
        setIsScreenSharing(false);
        setScreenStream(null);
      });
      
      // Make sure camera is still active
      if (mediaStream) {
        console.log('Camera tracks still active:', mediaStream.getTracks().length);
        mediaStream.getVideoTracks().forEach(track => {
          console.log('Camera track enabled:', track.enabled);
          track.enabled = true; // Ensure it stays enabled
        });
      }
      
      setScreenStream(stream);
      setIsScreenSharing(true);
      
    } catch (err) {
      console.error('Screen share cancelled or failed:', err);
    }
  }
};

  const candidateData = {
    name: "Yasir Ali",
    status: "Active",
    recording: "On",
    aiStatus: "Listening & Analyzing Candidate Response...",
    scores: {
      communication: 85,
      technical: 92,
      problemSolving: 88,
      adaptability: 80
    },
    summary: "Candidate demonstrated strong understanding of React and TypeScript by detailing work on a real-time dashboard. Highlighted use of hooks, context API, and type safety. Articulated effective performance optimization strategies, including memoization, debouncing, and immutable state management.",
    conversation: [
      {
        speaker: "AI Interviewer",
        message: "Excellent. Can you elaborate on a specific challenge you faced during this project and how you overcame it using a problem-solving approach?",
        isAI: true
      },
      {
        speaker: "Candidate",
        message: "We implemented 'React.memo' and 'useCallback' for component and function memoization. For data updates, we debounced and throttled API calls, and used 'immer' to manage immutable state efficiently, minimizing re-renders.",
        isAI: false
      },
      {
        speaker: "AI Interviewer",
        message: "That sounds interesting. How did you handle performance optimizations, particularly with frequent data updates in a real-time environment?",
        isAI: true
      },
      {
        speaker: "Candidate",
        message: "Certainly. At my previous role, I led the development of a real-time dashboard. I used React hooks for state management and context API for global data, ensuring type safety with TypeScript.",
        isAI: false
      },
      {
        speaker: "AI Interviewer",
        message: "Welcome! We'll start with some questions about your experience. Can you tell me about a project where you implemented a new feature using React and TypeScript?",
        isAI: true
      }
    ]
  };

  // If devices aren't configured, show the setup screen
  if (!devicesConfigured) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <DeviceSelector onDevicesReady={handleDevicesReady} />
      </div>
    );
  }

  // Main interview UI
  return (
    <div className="min-h-screen bg-gray-50 p-6" ref={containerRef}>
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Candidate Video */}
        <div className="space-y-6">
          {/* Candidate Video Card */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Video Area */}
            <div 
              className="relative bg-black" 
              style={{ 
                width: '100%', 
                height: '400px',
                overflow: 'hidden',
                borderRadius: '8px 8px 0 0'
              }}
            >
              {/* Screen Share Video (full screen when active) */}
              {isScreenSharing && screenStream && (
                <video
                  ref={screenVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                    backgroundColor: '#000',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 5
                  }}
                />
              )}
              
              {/* Camera Video (always visible, minimizes when screen sharing) */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={false}
                style={{
                  width: isScreenSharing ? '200px' : '100%',
                  height: isScreenSharing ? '120px' : '100%',
                  objectFit: 'cover',
                  display: 'block',
                  backgroundColor: '#000',
                  position: 'absolute',
                  bottom: isScreenSharing ? '20px' : 'auto',
                  right: isScreenSharing ? '20px' : 'auto',
                  top: isScreenSharing ? 'auto' : 0,
                  left: isScreenSharing ? 'auto' : 0,
                  zIndex: isScreenSharing ? 10 : 1,
                  border: isScreenSharing ? '2px solid #ef4444' : 'none',
                  borderRadius: isScreenSharing ? '8px' : '0',
                  transition: 'all 0.3s ease-in-out',
                  boxShadow: isScreenSharing ? '0 4px 12px rgba(0,0,0,0.5)' : 'none'
                }}
              />
              
              {/* Debug overlay */}
              {mediaStream && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: 'rgba(0,0,0,0.7)',
                  color: mediaStream.active ? '#0f0' : '#f00',
                  padding: '8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  zIndex: 50
                }}>
                  {/* Debug content - you can add back if needed */}
                </div>
              )}
              
              {/* Simple overlay with name and time */}
              <div style={{
                position: 'absolute',
                bottom: '0',
                left: '0',
                right: '0',
                padding: '15px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '16px',
                zIndex: 30
              }}>
                <span style={{ fontWeight: '500' }}>{candidateData.name}</span>
                <span style={{ fontFamily: 'monospace' }}>{currentTime}</span>
              </div>

              {/* LIVE indicator */}
              {mediaStream && mediaStream.active && (
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: '#ef4444',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 30
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    background: 'white',
                    borderRadius: '50%',
                    animation: 'pulse 1s infinite'
                  }}></span>
                  <span>LIVE</span>
                </div>
              )}

              {/* Screen share indicator */}
              {isScreenSharing && (
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  left: '15px',
                  background: '#2196f3',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  zIndex: 30
                }}>
                  <span>📺 SCREEN SHARING</span>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4 p-4 bg-white border-t">
              <button className="p-3 rounded-full hover:bg-gray-100 transition-colors" title="Mute microphone">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <button className="p-3 rounded-full hover:bg-gray-100 transition-colors" title="Toggle camera">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              
              {/* Screen Share Button */}
              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-full transition-colors ${
                  isScreenSharing ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-700'
                }`}
                title={isScreenSharing ? 'Stop sharing screen' : 'Share screen'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
              
              <button className="p-3 rounded-full hover:bg-gray-100 transition-colors" title="Show chat">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button
                onClick={handleEndInterview}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors font-medium"
              >
                End Interview
              </button>
            </div>
          </div>

          {/* Conversation Log */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="text-sm font-medium text-gray-500 mb-4">Conversation</div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {candidateData.conversation.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.isAI ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                    <span className="text-sm font-medium">{msg.isAI ? 'AI' : 'JD'}</span>
                  </div>
                  <div className={`flex-1 ${msg.isAI ? 'text-left' : 'text-right'}`}>
                    <div className={`inline-block max-w-[85%] px-4 py-2 rounded-lg text-sm ${msg.isAI
                      ? 'bg-blue-50 text-gray-800'
                      : 'bg-green-50 text-gray-800'
                      }`}>
                      <div className="font-medium text-xs mb-1 opacity-70">{msg.speaker}</div>
                      <div>{msg.message}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Status and Scoring */}
        <div className="space-y-6">
          {/* Current AI Status */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="text-sm font-medium text-gray-500 mb-2">Current AI Status</div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <Icon icon="heroicons:cpu-chip" className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="text-sm mt-2 text-indigo-600 leading-relaxed">
                {candidateData.aiStatus}
              </div>
            </div>
          </div>

          {/* Real-time Scoring */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="text-sm font-medium text-gray-500 mb-4">Real-time Scoring</div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Communication", score: candidateData.scores.communication, icon: "💬" },
                { label: "Technical Skills", score: candidateData.scores.technical, icon: "🎓" },
                { label: "Problem Solving", score: candidateData.scores.problemSolving, icon: "💡" },
                { label: "Adaptability", score: candidateData.scores.adaptability, icon: "📈" }
              ].map((item, idx) => (
                <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <div className="text-xs text-gray-600 mb-1">{item.label}</div>
                  <div className="text-2xl font-bold text-purple-600">{item.score}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Auto-Generated Summary */}
          <div className="bg-white rounded-lg shadow-sm p-5">
            <div className="text-sm font-medium text-gray-500 mb-3">Auto-Generated Summary</div>
            <div className="text-sm text-gray-700 leading-relaxed max-h-48 overflow-y-auto">
              {candidateData.summary}
            </div>
          </div>
        </div>
      </div>

      {/* Add keyframe animation for LIVE indicator */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
