import React from 'react';
import { remote } from 'electron';

/*
Reference from:
https://mylifeforthecode.github.io/making-the-electron-shell-as-pretty-as-the-visual-studio-shell/
*/
const TitleBar = () => {
  const handleMinimise = () => {
    const window = remote.getCurrentWindow();
    window.minimize();
  };

  const handleMaximise = () => {
    const window = remote.getCurrentWindow();
    if (!window.isMaximized()) {
      window.maximize();
    } else {
      window.unmaximize();
    }
  };

  const handleClose = () => {
    const window = remote.getCurrentWindow();
    window.close();
  };

  return (
    <div id="title-bar">
      <div id="title-bar-btns">
        <button type="button" id="close-btn" onClick={handleClose}>
          {' '}
        </button>
        <button type="button" id="min-btn" onClick={handleMinimise}>
          {' '}
        </button>
        <button type="button" id="max-btn" onClick={handleMaximise}>
          {' '}
        </button>
        <div id="title">ZoomBa</div>
      </div>
    </div>
  );
};

export default TitleBar;
