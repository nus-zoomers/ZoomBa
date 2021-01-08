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

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    if (forceUpdate) {
      // TODO: content not updated when store is updated
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
      setIndex(0);
      setIsPlaying(false);
      setForceUpdate(false);
    }
  }, [forceUpdate]);

  useEffect(() => {
    ipcRenderer.on('show-subwindow-from-main', () => {
      const window = remote.getCurrentWindow();
      window.show();
      window.focus();
      remote.app.dock.hide();
      window.setAlwaysOnTop(true, 'screen-saver');
      window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
      window.setFullScreenable(false);

      setForceUpdate(true);
    });
  }, []);

  useEffect(() => {
    if (!state.autoscroll && isPlaying) {
      const interval = setInterval(() => {
        if (index < state.content.length) {
          setIndex(index + 1);
        } else {
          setIsPlaying(false);
        }
      }, state.speed * 1000);
      return () => clearInterval(interval);
    }
    return () => null;
  }, [isPlaying, index, state.autoscroll, state.content.length, state.speed]);

  const handleTeleprompterExit = () => {
    ipcRenderer.send('show-mainwindow-to-main', '');
    const window = remote.getCurrentWindow();

    // cannot use window.close() due to same reason as above
    window.hide();
  };

  const handleTeleprompterBack = () => {
    // TODO: Implement back
    setIndex(index < state.content.length - 1 ? index + 1 : index);
  };

  const handleTeleprompterPausePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTeleprompterForward = () => {
    // TODO: Implement forward
    setIndex(index <= 0 ? 0 : index - 1);
  };

  const isLight = state.theme === Theme.LIGHT;

  const { fontSize } = state;
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
      <span
        className="zeroeth-line"
        style={{ fontSize }}
        key={`line-${index - 1}`}
      >
        {state.content[index - 1] ?? ''}
      </span>
      <span className="first-line" style={{ fontSize }} key={`line-${index}`}>
        {state.content[index] ?? ''}
      </span>
      <span
        className={`second-line${
          state.content[index + 1] === undefined ||
          state.content[index + 1] === ''
            ? ' is-empty'
            : ''
        }`}
        style={{ fontSize: secondLineFontSize }}
        key={`line-${index + 1}`}
      >
        {state.content[index + 1] ?? ''}
      </span>
      <span
        className="third-line"
        style={{ fontSize: secondLineFontSize }}
        key={`line-${index + 2}`}
      >
        {state.content[index + 2] ?? ''}
      </span>
      <div className="teleprompter-button-group">
        <button
          type="button"
          className="teleprompter-forward-button"
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
