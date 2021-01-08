import React, { useState } from 'react';
import { remote } from 'electron';
import { Theme } from '../home/components/ThemeSelection';
import ScrollingText from './ScrollingText';

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

  const items = ['line 1', 'line 2', 'line 3', 'line 4'];
  const [index, setIndex] = useState<number>(0);
  const [isForward, setIsForward] = useState<boolean>(true);

  const handleTeleprompterBack = () => {
    // TODO: Implement back
    if (index > 0) {
      setIndex(index - 1);
    } else {
      setIndex(items.length - 1);
    }
    setIsForward(false);
  };

  const handleTeleprompterPausePlay = () => {
    // TODO: Implement pause
  };

  const handleTeleprompterForward = () => {
    // TODO: Implement forward
    if (index < items.length - 1) {
      setIndex(index + 1);
    } else {
      setIndex(0);
    }
    setIsForward(true);
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

      <ScrollingText
        scriptArr={items}
        index={index}
        style="first-line"
        isForward={isForward}
        fontSize={fontSize}
      />

      <ScrollingText
        scriptArr={items}
        index={index + 1}
        style="second-line"
        isForward={isForward}
        fontSize={secondLineFontSize}
      />

      <div className="teleprompter-button-group">
        <button
          type="button"
          className="teleprompter-foward-button"
          onClick={handleTeleprompterForward}
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
          className="teleprompter-back-button"
          onClick={handleTeleprompterBack}
        >
          <i className="fas fa-arrow-down" />
        </button>
      </div>
    </div>
  );
};

export default Teleprompter;
