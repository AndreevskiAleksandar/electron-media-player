import React, {Component} from 'react';
import path from 'path';
import styles from './MediaPlayer.css';
import {remote} from 'electron';

export default class Playlist extends Component {

  constructor() {
    super();
    this.state = {files: []};
  }

  onItemClickEvent = (item) => {
    this.props.onItemClick(item);
  };

  renderList = () => {
    return this.state.files.map((item) =>
      <li className={styles.playlistItem} key={item.fullName} onClick={() => this.onItemClickEvent(item)}>
        {item.shortName}
      </li>);
  };

  getFileShortName = (file) => {
    return file.substring(file.lastIndexOf(path.sep) + 1);
  };

  openFiles = () => {
    remote.dialog.showOpenDialog({properties: ['multiSelections']},
      (fileNames) => {
        if (fileNames === undefined) return;

        this.setState({
          files: fileNames.map((file) => {
            return {
              fullName: file,
              shortName: this.getFileShortName(file)
            };
          })
        });
        this.props.stop();
      });

  };

  addFiles = () => {
    remote.dialog.showOpenDialog({properties: ['multiSelections']},
      (fileNames) => {
        if (fileNames === undefined) return;

        this.setState({files: Array.concat(this.state.files, fileNames)});
      });

  };

  clearList = () => {
    this.setState({files: []});
    this.props.stop();
  };

  render() {
    return (
      <div>
        <button id="openFiles" onClick={this.openFiles.bind(this)}>Open</button>
        <button id="addFiles" onClick={this.addFiles.bind(this)}>Add</button>
        <button id="clearList" onClick={this.clearList.bind(this)}>Clear</button>
        <ul className={styles.playlist}>
          {this.renderList()}
        </ul>
      </div>
    );
  }
}
