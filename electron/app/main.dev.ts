/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import WindowManager from './managers/WindowManager';
import OscManager from './managers/OscManager';
import { IPCArgments } from './reducers/types';
import GeneralPref from './models/GeneralPref';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

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
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const windowManager = new WindowManager();
const oscManager = new OscManager();
oscManager.open();

windowManager.on('open-oscport', generalPref => {
  const g = generalPref;
  oscManager.initOSCServer(
    g.clientHost,
    g.clientPort,
    g.serverHost,
    g.serverPort
  );
  oscManager.open();
});

windowManager.on('close-oscport', () => {
  oscManager.close();
});

oscManager.on('ipc-send-to-all-windows', (args: IPCArgments) => {
  windowManager.sendIpcMessageToAllWindows(
    '/v1/tinypianoroll/oscclip/notes',
    args
  );
});

ipcMain.on('/v1/tinypianoroll/preferences', (e, args: any) => {
  const g: GeneralPref = args.payload.general;
  const mode = args.payload.general.clientMode;
  if (mode === '') {
    oscManager.close();
  } else if (mode === 'bitwig') {
    oscManager.initOSCServer(
      g.clientHost,
      g.clientPort,
      g.serverHost,
      g.serverPort
    );
    oscManager.open();
  }
  windowManager.sendIpcMessageToAllWindows(
    '/v1/tinypianoroll/preferences',
    args
  );
});

ipcMain.on('update-theme', (e, themeObj) => {
  windowManager.sendIpcMessageToAllWindows('update-theme', themeObj);
});

const popPrefWindow = () => {
  windowManager.popPrefWindow();
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  windowManager.createWindows();
  if (windowManager.windows.mainWindow) {
    const menuBuilder = new MenuBuilder(windowManager.windows, popPrefWindow);
    menuBuilder.buildMenu();
  }

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', createWindow);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (windowManager.windows.mainWindow === null) createWindow();
});
