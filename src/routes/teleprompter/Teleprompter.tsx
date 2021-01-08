import React from 'react';
import { remote } from 'electron';

const { ipcRenderer } = window.require('electron');

const Teleprompter = () => {
  React.useEffect(() => {
    ipcRenderer.on('show-subwindow-from-main', () => {
      const window = remote.getCurrentWindow();
      window.show();
      // TOOD: can set to refresh script here. cuz currently can't create a new window- can only reuse the same one
      window.setAlwaysOnTop(true, 'screen-saver');
      window.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
      window.setFullScreenable(false);
    });
  }, []);

  const handleTeleprompterExit = () => {
    ipcRenderer.send('show-mainwindow-to-main', 'ping');
    const window = remote.getCurrentWindow();
    window.hide();
  };

  return (
    <>
      <div>testing this annoying window</div>
      <button
        type="button"
        className="tele-exit-button"
        onClick={handleTeleprompterExit}
      >
        Exit
      </button>
    </>
  );
};

export default Teleprompter;
