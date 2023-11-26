import React from 'react';
import './App.css';
import MicRecorder from 'mic-recorder-to-mp3';
import FormData from 'form-data'

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isRecording: false,
      blobURL: '',
      isBlocked: false,
    };
  }

  start = () => {
    if (this.state.isBlocked) {
      console.log('Permission Denied');
    } else {
      Mp3Recorder
        .start()
        .then(() => {
          this.setState({ isRecording: true });
        }).catch((e) => console.error(e));
    }
  };

  stop = () => {
    Mp3Recorder
      .stop()
      .getMp3()
      .then(([buffer, blob]) => {
        const blobURL = URL.createObjectURL(blob)
        this.setState({ blobURL, isRecording: false });

        let file = new File([blob], 'audio.mp3');

        console.log(file);

        var formdata = new FormData();
        formdata.append("audio_file", file);

        var requestOptions = {
          method: 'POST',
          body: formdata,
          redirect: 'follow'
        };

        fetch("http://localhost:8000/predict", requestOptions)
          .then(response => response.text())
          .then(result => console.log(result))
          .catch(error => console.log('error', error));


      }).catch((e) => console.log(e));
  };

  componentDidMount() {
    navigator.getUserMedia({ audio: true },
      () => {
        console.log('Permission Granted');
        this.setState({ isBlocked: false });
      },
      () => {
        console.log('Permission Denied');
        this.setState({ isBlocked: true })
      },
    );
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <button onClick={this.start} disabled={this.state.isRecording}>Record</button>
          <button onClick={this.stop} disabled={!this.state.isRecording}>Stop</button>
          <audio src={this.state.blobURL} controls="controls" />
        </header>
      </div>
    );
  }
}

export default App;
