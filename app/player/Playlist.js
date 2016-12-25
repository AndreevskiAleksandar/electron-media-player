import React, {Component} from 'react';
import fs from 'fs';
import styles from './MediaPlayer.css';
import {remote} from 'electron';

export default class Playlist extends Component {

  constructor() {
    super();
    this.state = {files: []};
    //  this.files = fs.readdirSync("D:\\Muzika");
  }

  onItemClickEvent = (item) => {
    this.props.onItemClick(item);
  };

  renderList = () => {

    return this.state.files.map((item) =>
      <li key={item} onClick={() => this.onItemClickEvent(item)}>
        {item}
      </li>);
  };


  openFile = () => {
    remote.dialog.showOpenDialog({properties: ['multiSelections']},
      (fileNames) => {
        if (fileNames === undefined) return;

        this.setState({files: Array.concat(this.state.files, fileNames)});
      });

  };

  render() {
    return (
      <div style={{border: '2px solid blue'}}>
        <button id="openFile" onClick={this.openFile.bind(this)}>Open</button>
        <ul>
          {this.renderList()}
        </ul>
      </div>
    );
  }
}
