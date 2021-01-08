/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./src/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, shell, ipcMain, webContents } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

import { store } from './app/store';
import MenuBuilder from './components/menu';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let subWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

let subWindowId: number;
let mainWindowId: number;

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources');

  const getAssetPath = (...paths: string[]): string =>
    path.join(RESOURCES_PATH, ...paths);

  const { width, height } = store.get('windowBounds');

  mainWindow = new BrowserWindow({
    show: false,
    width,
    height,
    frame: false,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });
  mainWindowId = mainWindow.id;

  mainWindow.loadURL(`file://${__dirname}/index.html?main`);

  subWindow = new BrowserWindow({
    show: false,
    width: 300,
    height: 70,
    frame: false,
    transparent: true,
    hasShadow: false,
    backgroundColor: '#40b2b2b2',
    icon: getAssetPath('icon.png'),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  subWindowId = subWindow.id;

  subWindow.loadURL(`file://${__dirname}/index.html?sub`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // The BrowserWindow class extends the node.js core EventEmitter class, so we use that API
  // to listen to events on the BrowserWindow. The resize event is emitted when the window size changes.
  mainWindow.on('resize', () => {
    // The event doesn't pass us the window size, so we call the `getBounds` method which returns an object with
    // the height, width, and x and y coordinates.
    if (mainWindow) {
      const rectangle = mainWindow.getBounds();
      const newWidth = rectangle.width;
      const newHeight = rectangle.height;
      // Now that we have them, save them using the `set` method.
      store.set('windowBounds', { width: newWidth, height: newHeight });
    }
  });

  // subWindow.webContents.on('did-finish-load', () => {
  //   if (!subWindow) {
  //     throw new Error('"subWindow" is not defined');
  //   }
  //   if (process.env.START_MINIMIZED) {
  //     subWindow.minimize();
  //   } else {
  //     subWindow.show();
  //     subWindow.minimize();
  //   }
  // });

  subWindow.on('closed', () => {
    subWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  const menuBuilderSub = new MenuBuilder(subWindow);
  menuBuilderSub.buildMenu();

  // Open urls in the user's browser
  subWindow.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow).catch(console.log);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

ipcMain.on('show-subwindow-to-main', () => {
  webContents.fromId(subWindowId).send('show-subwindow-from-main', '');
});

ipcMain.on('show-mainwindow-to-main', () => {
  webContents.fromId(mainWindowId).send('show-mainwindow-from-main', '');
});
