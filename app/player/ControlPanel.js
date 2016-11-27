import React, {Component} from 'react';
import styles from './MediaPlayer.css';

export default class ControlPanel extends Component {

  onPreviousEvent(e){
    this.props.onPrevious(e);
  }

  onNextEvent(e){
    this.props.onNext(e);
  }

  onPlayEvent(e){
    this.props.onPlay(e);
  }

  onStopEvent(e){
    this.props.onStop(e);
  }

  onPauseEvent(e){
    this.props.onPause(e);
  }

  onMuteEvent(e){
    this.props.onMute(e);
  }

  onVoiceUpEvent(e){
    this.props.onVoiceUp(e);
  }

  onVoiceDownEvent(e){
    this.props.onVoiceDown(e);
  }

  render() {
    return (
      <div style={{border: '2px solid yellow'}}>
        <div style={{textAlign: 'center'}}>
          <button onClick={this.onPreviousEvent.bind(this)}>Prev</button>
          <button onClick={this.onStopEvent.bind(this)}>Stop</button>
          <button onClick={this.onPlayEvent.bind(this)}>Play</button>
          <button onClick={this.onPauseEvent.bind(this)}>Pause</button>
          <button onClick={this.onNextEvent.bind(this)}>Next</button>
          <button onClick={this.onMuteEvent.bind(this)}>Mute</button>
          <button onClick={this.onVoiceDownEvent.bind(this)}>Voice Down</button>
          <button onClick={this.onVoiceUpEvent.bind(this)}>Voice Up</button>
        </div>
      </div>
    );
  }
}
