import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { AppWindowsType, IPCArgments } from '../reducers/types';
import GeneralPref, { GeneralPrefType } from '../models/GeneralPref';
import OscManager from './OscManager';
import Subscribable from './Subscribable';

export default class WindowManager extends Subscribable {
  rootPath: string;

  windows: AppWindowsType;

  constructor() {
    super();
    this.rootPath =
      process.env.NODE_ENV === 'development'
        ? path.resolve(__dirname, '..')
        : __dirname;
    this.windows = {
      mainWindow: null,
      editWindow: null,
      prefWindow: null
    };

    ipcMain.on(
      '/v1/tinypianoroll/preferences/osc',
      (event, args: IPCArgments) => {
        const generalPref: GeneralPrefType = args.payload;
        if (args.type === 'set') {
          if (generalPref.clientMode === '') {
            this.publish('close-oscport', null);
          } else {
            this.publish('open-oscport', generalPref);
          }
          this.sendIpcMessageToAllWindows(
            '/v1/tinypianoroll/preferences/osc',
            args
          );
        } else if (args.type === 'get') {
          // @todo
        }
      }
    );

    ipcMain.on('update-general-preferences', (event, generalPrefObj) => {
      this.sendIpcMessageToAllWindows(
        'update-general-preferences',
        generalPrefObj
      );
      if (generalPrefObj.clientMode === '') {
        this.publish('close-oscport', null);
      } else {
        this.publish('open-oscport', {
          generalPrefObj
        });
      }
    });
  }

  public createWindows(): void {
    this.createMainWindow();
    this.createEditWindow();
  }

  public sendIpcMessageToAllWindows(channel: string, args: IPCArgments): void {
    Object.keys(this.windows).forEach(key => {
      if (this.windows[key] !== null) {
        this.windows[key]?.webContents.send(channel, args);
      }
    });
  }

  private createEditWindow() {
    this.windows.editWindow = new BrowserWindow({
      show: false,
      width: 1920,
      height: 370,
      backgroundColor: '#2e2c29',
      frame: false,
      webPreferences:
        process.env.NODE_ENV === 'development' ||
        process.env.E2E_BUILD === 'true'
          ? {
              nodeIntegration: true,
              nodeIntegrationInWorker: true
            }
          : {
              preload: path.join(this.rootPath, 'dist/renderer.prod.js'),
              backgroundThrottling: false
            }
    });
    this.windows.editWindow.loadURL(`file://${this.rootPath}/app.html#editor`);
    /**
     * Add event listeners...
     */
    this.windows.editWindow.webContents.on('did-finish-load', () => {
      if (!this.windows.editWindow) {
        throw new Error('"mainWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        this.windows.editWindow.minimize();
      } else {
        this.windows.editWindow.show();
        this.windows.editWindow.focus();
      }
    });
    this.windows.editWindow.on('closed', () => {
      this.windows.editWindow = null;
    });
  }

  private createMainWindow() {
    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    this.windows.mainWindow = new BrowserWindow({
      show: false,
      width: 1024,
      height: 728,
      webPreferences:
        process.env.NODE_ENV === 'development' ||
        process.env.E2E_BUILD === 'true'
          ? {
              nodeIntegration: true,
              nodeIntegrationInWorker: true
            }
          : {
              preload: path.join(this.rootPath, 'dist/renderer.prod.js'),
              backgroundThrottling: false
            }
    });
    this.windows.mainWindow.loadURL(`file://${this.rootPath}/app.html`);
    /**
     * Add event listeners...
     */
    this.windows.mainWindow.webContents.on('did-finish-load', () => {
      if (!this.windows.mainWindow) {
        throw new Error('"mainWindow" is not defined');
      }
      if (process.env.START_MINIMIZED) {
        this.windows.mainWindow.minimize();
      } else if (process.env.NODE_ENV === 'production') {
        // this.windows.mainWindow.show();
        // this.windows.mainWindow.focus();
      }
    });
    this.windows.mainWindow.on('closed', () => {
      this.windows.mainWindow = null;
    });
  }

  public popPrefWindow() {
    if (!this.windows.prefWindow) {
      this.windows.prefWindow = new BrowserWindow({
        show: false,
        width: 620,
        height: 768,
        webPreferences:
          process.env.NODE_ENV === 'development' ||
          process.env.E2E_BUILD === 'true'
            ? {
                nodeIntegration: true,
                nodeIntegrationInWorker: true
              }
            : {
                preload: path.join(this.rootPath, 'dist/renderer.prod.js'),
                backgroundThrottling: false
              }
      });

      this.windows.prefWindow.loadURL(
        `file://${this.rootPath}/app.html#preferences`
      );
      this.windows.prefWindow.webContents.on('did-finish-load', () => {
        if (!this.windows.prefWindow) {
          throw new Error('"prefWindow" is not defined');
        } else {
          this.windows.prefWindow.show();
          this.windows.prefWindow.focus();
        }
      });
      this.windows.prefWindow.on('closed', () => {
        this.windows.prefWindow = null;
      });
    } else {
      this.windows.prefWindow.show();
    }
  }
}
