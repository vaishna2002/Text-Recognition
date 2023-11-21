import React, { useRef, useEffect } from 'react';
import "./App.css"
import { useReactMediaRecorder } from 'react-media-recorder';
import convertBlobToWav from 'audio-recorder-polyfill';

const App = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
  });

  const videoRef = useRef(null);

  useEffect(() => {
    if (status === 'recording') {
      // Access the user's camera and display the video stream
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });
    }
  }, [status]);

  const handleDownload = async () => {
    if (mediaBlobUrl) {
      try {
        const audioBlob = await fetch(mediaBlobUrl).then(response => response.blob());
        localStorage.setItem('audio', audioBlob);

        // ... rest of your download logic
      } catch (error) {
        console.error('Error handling download:', error);
      }
    }
  };

  return (
    <div id="container1">
      <div id="twobuttons">
        <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop Recording</button>
      </div>
      <div id="record">
        <video ref={videoRef} style={{ width: '100%', maxHeight: '300px' }} autoPlay muted />
        <audio src={mediaBlobUrl} controls autoPlay />
        {mediaBlobUrl && (
          <button onClick={handleDownload}>Download Recording</button>
        )}
      </div>
      <div id="showbutton">
        <button onClick={() => console.log(localStorage.getItem('audio'))}>Show</button>
      </div>
    </div>
  );
};

export default App;
