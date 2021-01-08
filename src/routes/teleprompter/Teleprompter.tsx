import React, { useState, useEffect, useReducer } from 'react';
import { remote } from 'electron';
import { Theme } from '../home/components/ThemeSelection';

import { store } from '../../app/store';

const { ipcRenderer } = window.require('electron');

const Teleprompter = () => {
  interface TeleprompterState {
    content: string[];
    name: string;
    prompt: string;
    theme: Theme;
    fontSize: number;
    autoscroll: boolean;
    speed: number;
  }

  const [state, setState] = useReducer(
    (s: TeleprompterState, a: Partial<TeleprompterState>) => ({ ...s, ...a }),
    {
      content: [],
      name: '',
      prompt: '',
      theme: Theme.LIGHT,
      fontSize: 24,
      autoscroll: true,
      speed: 3.0,
    }
  );

  useEffect(() => {
    // content not updated when store is updated
    const { content, name, prompt } = store.get('script');
    const { theme, fontSize, autoscroll, speed } = store.get('config');

    setState({
      content: content.replace(/^\s*[\r\n]/gm, '').split('\n'),
      name,
      prompt,
      theme,
      fontSize,
      autoscroll,
      speed,
    });
  }, []);

  const [lineNumber, setLineNumber] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
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

  useEffect(() => {
    if (!state.autoscroll && isPlaying) {
      const interval = setInterval(() => {
        if (lineNumber < state.content.length) {
          setLineNumber(lineNumber + 1);
        } else {
          setIsPlaying(false);
        }
      }, state.speed * 1000);
      return () => clearInterval(interval);
    }
    return () => null;
  }, [
    isPlaying,
    lineNumber,
    state.autoscroll,
    state.content.length,
    state.speed,
  ]);

  const handleTeleprompterExit = () => {
    ipcRenderer.send('show-mainwindow-to-main', '');
    const window = remote.getCurrentWindow();

    // cannot use window.close() due to same reason as above
    window.hide();
  };

  const handleTeleprompterBack = () => {
    setLineNumber(lineNumber - 1);
  };

  const handleTeleprompterPausePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTeleprompterForward = () => {
    setLineNumber(lineNumber + 1);
  };

  const isLight = state.theme === Theme.LIGHT;

  const { fontSize } = state;
  const secondLineFontSize = fontSize * 0.6;

  const firstLine = (() => {
    if (state.content[lineNumber]) return state.content[lineNumber];
    if (lineNumber === state.content.length) return '[END]';
    return `"${state.name}"`;
  })();

  const secondLine = (() => {
    if (state.content[lineNumber + 1]) return state.content[lineNumber + 1];
    if (lineNumber === state.content.length - 1) return '[END]';
    return 'Congrats on finishing your presentation :>';
  })();

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
        {firstLine}
      </span>
      <span className="second-line" style={{ fontSize: secondLineFontSize }}>
        {secondLine}
      </span>
      <div className="teleprompter-button-group">
        <button
          type="button"
          className="teleprompter-back-button"
          onClick={handleTeleprompterBack}
          disabled={lineNumber < 0}
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
          disabled={lineNumber > state.content.length - 1}
        >
          <i className="fas fa-arrow-down" />
        </button>
      </div>
    </div>
  );
};

export default Teleprompter;
