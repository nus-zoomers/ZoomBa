import React from 'react';
import { remote } from 'electron';

const { ipcRenderer } = window.require('electron');

const Teleprompter = () => {
  React.useEffect(() => {
    ipcRenderer.on('show-subwindow-from-main', () => {
      const window = remote.getCurrentWindow();
      window.show();
      window.focus();
      // TODO: can set to refresh script here. cuz currently can't create a new window- can only reuse the same one
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
