import React, { useRef, useEffect } from "react";
import "./App.css";
import { useReactMediaRecorder } from "react-media-recorder";
import convertBlobToWav from "audio-recorder-polyfill";
import axios from "axios";
import FormData from "form-data";

const App = () => {
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
    });

  const videoRef = useRef(null);

  useEffect(() => {
    if (status === "recording") {
      // Access the user's camera and display the video stream
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          console.error("Error accessing camera:", error);
        });
    }
  }, [status]);

  const handleDownload = async () => {
    if (mediaBlobUrl) {
      try {
        const audioBlob = await fetch(mediaBlobUrl).then((response) =>
          response.blob()
        );

        // Create a File object from the Blob with a specified filename and mime type
        const audioFile = new File([audioBlob], "audio.wav", {
          type: "audio/wav",
        });

        console.log(audioFile);

        let data = new FormData();
        data.append("audio_file", audioFile);

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "http://127.0.0.1:8000/predict",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
          })
          .catch((error) => {
            console.log(error);
          });

        // ... rest of your download logic
      } catch (error) {
        console.error("Error handling download:", error);
      }
    }
  };

  const handleSubmit = () => {};

  return (
    <div id="container1">
      <div id="twobuttons">
        <button onClick={startRecording}>Start Recording</button>
        <button onClick={stopRecording}>Stop Recording</button>
      </div>
      <div><p>Here you will get Question</p>
      <h3>How Are You Feeling ?</h3></div>
      <div id="record">
        <video
          ref={videoRef}
          style={{ width: "100%", maxHeight: "300px" }}
          autoPlay
          muted
        />
        <audio src={mediaBlobUrl} controls autoPlay />
        {mediaBlobUrl && (
          <button onClick={handleDownload}>Download Recording</button>
        )}
      </div>
      <div id="showbutton">
        <button onClick={handleSubmit}>Show</button>
      </div>
    </div>
  );
};

export default App;