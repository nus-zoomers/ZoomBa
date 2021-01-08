import React from 'react';
import { remote } from 'electron';
import { Theme } from '../home/components/ThemeSelection';

const { ipcRenderer } = window.require('electron');

const Teleprompter = () => {
  React.useEffect(() => {
    ipcRenderer.on('show-subwindow-from-main', () => {
      const window = remote.getCurrentWindow();
      window.show();
      window.focus();
      // TODO: can set to refresh script here. cuz currently can't create a new window - can only reuse the same one
      remote.app.dock.hide();
      window.setAlwaysOnTop(true, 'screen-saver');
      window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
      window.setFullScreenable(false);
    });
  }, []);

  const handleTeleprompterExit = () => {
    ipcRenderer.send('show-mainwindow-to-main', '');
    const window = remote.getCurrentWindow();

    // cannot use window.close() due to same reason as above
    window.hide();
  };

  const handleTeleprompterBack = () => {
    // TODO: Implement back
  };

  const handleTeleprompterPausePlay = () => {
    // TODO: Implement pause
  };

  const handleTeleprompterForward = () => {
    // TODO: Implement forward
  };

  // Placeholder variables for styling, please
  // replace with actual values once available
  const theme = Theme.LIGHT;

  const isLight = theme === Theme.LIGHT;

  const isPlaying = true;

  const fontSize = 32;
  const secondLineFontSize = fontSize * 0.6;

  return (
    <div className={`teleprompter${isLight ? ' is-light' : ' is-dark'}`}>
      <button
        type="button"
        className="teleprompter-close-button"
        onClick={handleTeleprompterExit}
      >
        <i className="fas fa-times" />
      </button>
      <span className="first-line" style={{ fontSize }}>
        This is the first line.
      </span>
      <span className="second-line" style={{ fontSize: secondLineFontSize }}>
        This is the second line.
      </span>
      <div className="teleprompter-button-group">
        <button
          type="button"
          className="teleprompter-back-button"
          onClick={handleTeleprompterBack}
        >
          <i className="fas fa-arrow-up" />
        </button>
        <button
          type="button"
          className="teleprompter-pause-play-button"
          onClick={handleTeleprompterPausePlay}
        >
          {isPlaying ? (
            <i className="fas fa-pause" />
          ) : (
            <i className="fas fa-play" />
          )}
        </button>
        <button
          type="button"
          className="teleprompter-foward-button"
          onClick={handleTeleprompterForward}
        >
          <i className="fas fa-arrow-down" />
        </button>
      </div>
    </div>
  );
};

export default Teleprompter;
