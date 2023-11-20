import React from 'react';
import "./App.css"
import { useReactMediaRecorder } from 'react-media-recorder';
import convertBlobToWav from 'audio-recorder-polyfill';

const App = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
  });

  const handleDownload = async () => {
    if (mediaBlobUrl) {
      try {
        const audioBlob = await fetch(mediaBlobUrl).then(response => response.blob());
        localStorage.setItem('audio' , audioBlob)

        // ... rest of your download logic
      } catch (error) {
        console.error('Error handling download:', error);
      }
    }
  };

  return (
    <div id="container1">
      {/* <p>{status}</p> */}
      <div id="twobuttons">
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      </div>
      <div id="record">
      <audio src={mediaBlobUrl} controls autoPlay />
      {mediaBlobUrl && (
        <button1 onClick={handleDownload}>Download Recording</button1>
      )}
      </div>
      <div id="showbutton">
        <button onClick={()=>console.log(localStorage.getItem('audio'))} >Show</button>
      </div>  
    </div>
  );
};

export default App;
