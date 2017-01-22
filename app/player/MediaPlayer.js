import React, {Component} from 'react';
import Playlist from './Playlist';
import ControlPanel from './ControlPanel';
import Screen from './Screen';
import styles from './MediaPlayer.css';
import fs from 'fs';
import path from 'path';

export default class MediaPlayer extends Component {


  constructor(props) {
    super(props);
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();// define audio context
    // this.gainNode = this.audioContext.createGain(); // see if this is needed or needs recreation on every new song
    this.state = {
      source: null,
      playlistFiles: [],
      currentSong: null
    };
  }

  componentDidMount() {
    this.canvas = document.querySelector('#canvas');
    this.canvasCtx = this.canvas.getContext("2d");
  }


  visualise = () => {
    let WIDTH = this.canvas.width;
    let HEIGHT = this.canvas.height;


    this.analyserNode.fftSize = 512;
    var bufferLength = this.analyserNode.fftSize;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);

    this.canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    this.drawVisual;
    let draw = () => {
      console.log("draw");
      this.drawVisual = requestAnimationFrame(draw);
      this.analyserNode.getByteTimeDomainData(dataArray);

      this.canvasCtx.fillStyle = 'rgb(200, 200, 200)';
      this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      this.canvasCtx.lineWidth = 2;
      this.canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

      this.canvasCtx.beginPath();

      var sliceWidth = WIDTH * 1.0 / bufferLength;
      var x = 0;

      for (var i = 0; i < bufferLength; i++) {

        var v = dataArray[i] / 128.0;
        var y = v * HEIGHT / 2;

        if (i === 0) {
          this.canvasCtx.moveTo(x, y);
        } else {
          this.canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      this.canvasCtx.lineTo(canvas.width, canvas.height / 2);
      this.canvasCtx.stroke();
    };

    draw();
  };

  stop = () => {
    if (this.state.source) {
      this.state.source.stop();
    }
    window.cancelAnimationFrame(this.drawVisual);
  };

  play = (buffer) => {
    this.stop();

    if (!this.audioContext.createGain) {
      this.audioContext.createGain = this.audioContext.createGainNode;
    }
    this.gainNode = this.audioContext.createGain();
    this.analyserNode = this.audioContext.createAnalyser();

    // Create a source node from the buffer
    let source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    this.setState({source});
    // Connect to the final output node (the speakers)
    this.state.source.connect(this.analyserNode);
    this.analyserNode.connect(this.gainNode);

    this.gainNode.connect(this.audioContext.destination);
    // Play immediately
    this.state.source.start(0);
    //this.visualise();
  };


  playByteArray = (byteArray) => {

    let arrayBuffer = new ArrayBuffer(byteArray.length);
    let bufferView = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteArray.length; i++) {
      bufferView[i] = byteArray[i];
    }

    this.audioContext.decodeAudioData(arrayBuffer, (buffer)=> {
      this.play(buffer);
    });
  };

  playAudioFile = (file) => {
    if (!file) {
      return;
    }
    if (this.state.source) {
      this.stop();
    }

    // var openSync = fs.openSync(`${file.fullName}`, 'r'); //throws error if file doesn't exist
    var data = fs.readFileSync(file.fullName); //file exists, get the contents
    this.setState({
      currentSong: file
    });
    this.playByteArray(data);
  };


  onItemClickEvent = (item) => {
    console.log(item);
    this.playAudioFile(item);
  };

  onPreviousEvent = (e) => {
    let index = this.findCurrentSongIndex();
    index = (index - 1) % this.state.playlistFiles.length;
    index = index < 0 ? this.state.playlistFiles.length - 1 : index;
    this.playAudioFile(this.state.playlistFiles[index]);
  };

  onNextEvent = (e) => {
    let index = this.findCurrentSongIndex();
    index = (index + 1) % this.state.playlistFiles.length;
    this.playAudioFile(this.state.playlistFiles[index]);
  };

  onPlayEvent = (e) => {
    this.playAudioFile();
  };

  onStopEvent = (e) => {
    console.log("Stop", e);
    this.stop();
  };

  onPauseEvent = (e) => {
    console.log("Pause", e)
  };

  onMuteEvent = (e) => {
    console.log("Mute", e)
  };

  onVoiceUpEvent = (e) => {
    console.log("VoiceUp", e)
  };

  onVoiceDownEvent = (e) => {
    console.log("VoiceDown", e)
  };

  findCurrentSongIndex = () => {
    let index = this.state.playlistFiles.findIndex((song) => {
      if (song.fullName === this.state.currentSong.fullName) {
        return true;
      }
      return false;
    });
    return index;
  };

  updatePlaylist = (fileNames, append) => {
    if (append) {
      this.setState({
        playlistFiles: Array.concat(this.state.playlistFiles, fileNames.map((file) => {
          return this.filenameToFileObject(file);
        }))
      });
    } else {
      this.setState({
        playlistFiles: fileNames.map((file) => {
          return this.filenameToFileObject(file);
        })
      });
      this.stop();
    }

  };

  filenameToFileObject = (file) => {
    return {
      fullName: file,
      shortName: this.getFileShortName(file)
    };
  };

  getFileShortName = (file) => {
    return file.substring(file.lastIndexOf(path.sep) + 1);
  };

  render() {
    return (
      <div className={styles.playerContainer}>
        <main className={styles.mainContainer}>
          <div className={styles.screenContainer}>
            <canvas id="canvas" width="600px" height="200px" style={{border: "2px solid blue"}}/>

          </div>
          <div className={styles.playlistContainer}>
            <Playlist playlistFiles={this.state.playlistFiles} onItemClick={this.onItemClickEvent}
                      updatePlaylist={this.updatePlaylist} currentSong={this.state.currentSong}/>
          </div>
        </main>
        <footer className={styles.controlPanelContainer}>
          <ControlPanel
            onPlay={this.onPlayEvent}
            onPrevious={this.onPreviousEvent}
            onNext={this.onNextEvent}
            onStop={this.onStopEvent}
            onPause={this.onPauseEvent}
            onMute={this.onMuteEvent}
            onVoiceUp={this.onVoiceUpEvent}
            onVoiceDown={this.onVoiceDownEvent}
          />
        </footer>
      </div>
    );
  }
}
