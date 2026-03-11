import { useState, useEffect, useCallback, useRef } from 'react';

export const useWebRTCDevices = () => {
  const [devices, setDevices] = useState({
    audioInputs: [],
    audioOutputs: [],
    videoInputs: []
  });
  const [selectedDevices, setSelectedDevices] = useState({
    audioInput: '',
    audioOutput: '',
    videoInput: ''
  });
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const getDevices = useCallback(async () => {
    try {
      const deviceInfos = await navigator.mediaDevices.enumerateDevices();
      
      const audioInputs = [];
      const audioOutputs = [];
      const videoInputs = [];
      
      let hasPermission = false;
      
      deviceInfos.forEach(deviceInfo => {
        if (deviceInfo.deviceId) {
          hasPermission = true;
        }
        
        switch (deviceInfo.kind) {
          case 'audioinput':
            audioInputs.push({
              deviceId: deviceInfo.deviceId,
              label: deviceInfo.label || `Microphone ${audioInputs.length + 1}`,
              kind: deviceInfo.kind
            });
            break;
          case 'audiooutput':
            audioOutputs.push({
              deviceId: deviceInfo.deviceId,
              label: deviceInfo.label || `Speaker ${audioOutputs.length + 1}`,
              kind: deviceInfo.kind
            });
            break;
          case 'videoinput':
            videoInputs.push({
              deviceId: deviceInfo.deviceId,
              label: deviceInfo.label || `Camera ${videoInputs.length + 1}`,
              kind: deviceInfo.kind
            });
            break;
          default:
            break;
        }
      });
      
      setDevices({ audioInputs, audioOutputs, videoInputs });
      setPermissionGranted(hasPermission);
      
    } catch (error) {
      console.error('Error getting devices:', error);
      setError('Failed to get device list');
    }
  }, []);

  const startStream = useCallback(async (constraints) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      // Refresh device list to get labels
      await getDevices();
      
      return mediaStream;
    } catch (error) {
      console.error('Error starting stream:', error);
      setError(error.message || 'Failed to access media devices');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [stream, getDevices]);

  const requestPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      stream.getTracks().forEach(track => track.stop());
      await getDevices();
      return true;
    } catch (error) {
      setError('Please grant camera and microphone permissions');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [getDevices]);

  useEffect(() => {
    getDevices();
    
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [getDevices, stream]);

  return {
    devices,
    selectedDevices,
    setSelectedDevices,
    permissionGranted,
    stream,
    error,
    isLoading,
    startStream,
    requestPermissions,
    getDevices
  };
};