import React, {Component} from 'react';
import Playlist from './Playlist';
import ControlPanel from './ControlPanel';
import Screen from './Screen';
import styles from './MediaPlayer.css';
import fs from 'fs';

export default class MediaPlayer extends Component {


  constructor(props) {
    super(props);
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();// define audio context
    // this.gainNode = this.audioContext.createGain(); // see if this is needed or needs recreation on every new song
    this.state = {source: null};
  }


  stop = () => {
    this.state.source.stop();
  };

  play = (buffer) => {
    if (this.state.source) {
      this.stop();
    }
    if (!this.audioContext.createGain)
      this.audioContext.createGain = this.audioContext.createGainNode;
    this.gainNode = this.audioContext.createGain();
    // Create a source node from the buffer
    let source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    this.setState({source});
    // Connect to the final output node (the speakers)
    this.state.source.connect(this.gainNode);
    this.gainNode.connect(this.audioContext.destination);
    // Play immediately
    this.state.source.start(0);
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
    if (this.state.source) {
      this.stop();
    }
    fs.openSync(`${file}`, 'r'); //throws error if file doesn't exist
    var data = fs.readFileSync(`${file}`); //file exists, get the contents
    this.playByteArray(data);
  };


  onItemClickEvent = (item) => {
    console.log(item);
    this.playAudioFile(item);
  };

  onPreviousEvent = (e) => {
    console.log("Previous", e)
  };

  onNextEvent = (e) => {
    console.log("Next", e)
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


  render() {
    return (
      <div style={{border: '2px solid green'}}>
        <div style={{width: '100%'}}>
          <div className={styles.screenContainer}>
            <Screen />
          </div>
          <div className={styles.playlistContainer}>
            <Playlist onItemClick={this.onItemClickEvent}/>
          </div>
        </div>
        <div className={styles.controlPanelContainer}>
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
        </div>
      </div>
    );
  }
}
