import React, {Component} from 'react';
import styles from './MediaPlayer.css';
import {remote} from 'electron';

export default class Playlist extends Component {

  constructor() {
    super();
  }

  onItemClickEvent = (item) => {
    this.props.onItemClick(item);
  };

  renderList = () => {
    return this.props.playlistFiles.map((item) =>
      <li className={styles.playlistItem} key={item.fullName} onClick={() => this.onItemClickEvent(item)}>
        {item.shortName}
      </li>);
  };


  openFiles = () => {
    remote.dialog.showOpenDialog({properties: ['multiSelections']},
      (fileNames) => {
        if (fileNames === undefined) return;
        this.props.updatePlaylist(fileNames, false);
      });
  };

  addFiles = () => {
    remote.dialog.showOpenDialog({properties: ['multiSelections']},
      (fileNames) => {
        if (fileNames === undefined) return;
        this.props.updatePlaylist(fileNames, true);
      });
  };

  clearList = () => {
    this.props.updatePlaylist([], false);
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
