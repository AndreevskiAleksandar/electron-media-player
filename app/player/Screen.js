import React, {Component} from 'react';
import styles from './MediaPlayer.css';

export default class Screen extends Component {

  componentDidMount() {
    this.canvas = document.querySelector('#screenCanvas');
    this.canvasCtx = this.canvas.getContext("2d");

    var intendedWidth = document.querySelector('#screenCanvasWrapper').clientWidth;

    this.canvas.setAttribute('width', intendedWidth);
  }


  render() {
    return (
      <div id="screenCanvasWrapper">
        <canvas id="screenCanvas" style={{border: "1px solid green"}} height="200px"/>
      </div>
    );
  }
}
