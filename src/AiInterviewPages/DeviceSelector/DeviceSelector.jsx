import React, { useState, useEffect, useCallback, useRef } from 'react';
import './DeviceSelector.css';

const DeviceSelector = ({ onDevicesReady }) => {
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
  const [cameraStream, setCameraStream] = useState(null);
  const [hasMic, setHasMic] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const cameraVideoRef = useRef(null);
  const audioOutputSupported = 'sinkId' in HTMLMediaElement.prototype;

  // Get all available devices
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
      setHasMic(audioInputs.length > 0);
      setHasCamera(videoInputs.length > 0);
      setPermissionGranted(hasPermission);
      
      // Set default selections
      if (audioInputs.length > 0 && !selectedDevices.audioInput) {
        setSelectedDevices(prev => ({ ...prev, audioInput: audioInputs[0].deviceId }));
      }
      if (videoInputs.length > 0 && !selectedDevices.videoInput) {
        setSelectedDevices(prev => ({ ...prev, videoInput: videoInputs[0].deviceId }));
      }
      
    } catch (error) {
      console.error('Error getting devices:', error);
      setError('Failed to get device list');
    }
  }, []);

  // Start camera stream
  const startCameraStream = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        audio: hasMic ? {
          deviceId: selectedDevices.audioInput ? { exact: selectedDevices.audioInput } : undefined
        } : false,
        video: hasCamera ? {
          deviceId: selectedDevices.videoInput ? { exact: selectedDevices.videoInput } : undefined
        } : false
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (cameraVideoRef.current) {
        cameraVideoRef.current.srcObject = stream;
      }
      
      setCameraStream(stream);
      
    } catch (error) {
      console.error('Error starting camera:', error);
      setError(error.message || 'Failed to access camera');
    } finally {
      setIsLoading(false);
    }
  }, [cameraStream, hasMic, hasCamera, selectedDevices]);

  // Initialize
  useEffect(() => {
    getDevices();
    
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [getDevices, cameraStream]);

  // Auto-start camera when permission granted
  useEffect(() => {
    if (permissionGranted && (hasMic || hasCamera) && !cameraStream) {
      startCameraStream();
    }
  }, [permissionGranted, hasMic, hasCamera, startCameraStream, cameraStream]);

  const requestPermissions = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      stream.getTracks().forEach(track => track.stop());
      await getDevices();
    } catch (error) {
      console.error('Permission error:', error);
      setError('Please grant camera and microphone permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartInterview = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => {
        track.enabled = true;
      });
      onDevicesReady(cameraStream);
    } else {
      setError('Please configure your devices first');
    }
  };

  return (
    <div className="device-selector-container">
      <h2>Audio/Video Device Settings</h2>
      <p className="setup-description">Configure your devices before starting the interview</p>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}
      
      {!permissionGranted && (
        <div className="permission-request">
          <p>We need access to your camera and microphone</p>
          <button onClick={requestPermissions} disabled={isLoading} className="primary-button">
            {isLoading ? 'Requesting...' : 'Grant Permissions'}
          </button>
        </div>
      )}
      
      <div className="device-controls">
        <div className="select-group">
          <label>Microphone:</label>
          <select
            value={selectedDevices.audioInput}
            onChange={(e) => setSelectedDevices(prev => ({ ...prev, audioInput: e.target.value }))}
            disabled={!hasMic || isLoading}
          >
            <option value="">Select microphone</option>
            {devices.audioInputs.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="select-group">
          <label>Camera:</label>
          <select
            value={selectedDevices.videoInput}
            onChange={(e) => setSelectedDevices(prev => ({ ...prev, videoInput: e.target.value }))}
            disabled={!hasCamera || isLoading}
          >
            <option value="">Select camera</option>
            {devices.videoInputs.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Camera Preview */}
      <div className="preview-section">
        <h3>Camera Preview</h3>
        <div className="video-preview">
          <video
            ref={cameraVideoRef}
            autoPlay
            playsInline
            muted
            className={cameraStream ? 'active' : 'inactive'}
          />
          {!cameraStream && !isLoading && (
            <div className="video-placeholder">
              <p>Camera preview will appear here</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="device-actions">
        <button 
          onClick={startCameraStream} 
          disabled={(!hasMic && !hasCamera) || isLoading}
          className="secondary-button"
        >
          {isLoading ? 'Starting...' : 'Test Camera'}
        </button>
        
        <button 
          onClick={handleStartInterview}
          disabled={!cameraStream || isLoading}
          className="primary-button start-interview-btn"
        >
          Start Interview
        </button>
      </div>
      
      <div className="device-info">
        <p><strong>Note:</strong> Make sure your camera and microphone are working before starting.</p>
      </div>
    </div>
  );
};

export default DeviceSelector;


