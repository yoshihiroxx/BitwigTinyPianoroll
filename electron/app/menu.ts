/* eslint @typescript-eslint/ban-ts-ignore: off */
import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
  remote,
  dialog,
  ipcMain
} from 'electron';
import MidiParser from 'midi-parser-js';

import fs from 'fs';

import { AppWindowsType } from './reducers/types';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
  appWindows: AppWindowsType;

  popPrefWindow: () => void;

  constructor(appWindows: AppWindowsType, popPrefWindow: () => void) {
    this.appWindows = appWindows;
    this.popPrefWindow = popPrefWindow;
  }

  buildMenu() {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment() {
    this.appWindows.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.appWindows.mainWindow.webContents.inspectElement(x, y);
          }
        }
      ]).popup({ window: this.appWindows.mainWindow });
    });
  }

  buildDarwinTemplate() {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'BitwigTinyPianoroll',
      submenu: [
        {
          label: 'About ElectronReact',
          selector: 'orderFrontStandardAboutPanel:'
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide ElectronReact',
          accelerator: 'Command+H',
          selector: 'hide:'
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:'
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Preferences',
          accelerator: 'Command+,',
          click: () => {
            this.popPrefWindow();
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    };
    const subMenuFile: DarwinMenuItemConstructorOptions = {
      label: 'File',
      submenu: [
        {
          label: 'New Midi File',
          click: () => {
            this.appWindows.editWindow.webContents.send('new-midifile');
          }
        },
        { type: 'separator' },
        {
          label: 'Open Midi File (Maschine)',
          click: () => {
            dialog
              .showOpenDialog({
                properties: ['openFile', 'multiSelections'],
                filters: [
                  { name: 'Midi Files', extensions: ['mid'] },
                  { name: 'All Files', extensions: ['*'] }
                ]
              })
              .then(result => {
                const file = fs.readFileSync(result.filePaths[0], 'base64');
                const parsedMidi = MidiParser.parse(file);
                this.appWindows.editWindow.webContents.send(
                  'load-midifile',
                  parsedMidi
                );
                return true;
              })
              .catch(err => {
                console.log(err);
              });
          }
        }
      ]
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:'
        }
      ]
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.appWindows.mainWindow.webContents.reload();
          }
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.appWindows.mainWindow.setFullScreen(
              !this.appWindows.mainWindow.isFullScreen()
            );
          }
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.appWindows.mainWindow.webContents.toggleDevTools();
          }
        }
      ]
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.appWindows.mainWindow.setFullScreen(
              !this.appWindows.mainWindow.isFullScreen()
            );
          }
        }
      ]
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:'
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' }
      ]
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('https://electronjs.org');
          }
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal(
              'https://github.com/electron/electron/tree/master/docs#readme'
            );
          }
        },
        {
          label: 'Community Discussions',
          click() {
            shell.openExternal('https://www.electronjs.org/community');
          }
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          }
        }
      ]
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [
      subMenuAbout,
      subMenuFile,
      subMenuEdit,
      subMenuView,
      subMenuWindow,
      subMenuHelp
    ];
  }

  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '&File',
        submenu: [
          {
            label: '&Open',
            accelerator: 'Ctrl+O'
          },
          {
            label: 'Open Midi File (Maschine)',
            click: () => {
              // @todo support menus for windows.
            }
          },
          {
            label: '&Close',
            accelerator: 'Ctrl+W',
            click: () => {
              this.app.mainWindow.close();
            }
          }
        ]
      },
      {
        label: '&View',
        submenu:
          process.env.NODE_ENV === 'development' ||
          process.env.DEBUG_PROD === 'true'
            ? [
                {
                  label: '&Reload',
                  accelerator: 'Ctrl+R',
                  click: () => {
                    this.app.mainWindow.webContents.reload();
                  }
                },
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.app.mainWindow.setFullScreen(
                      !this.app.mainWindow.isFullScreen()
                    );
                  }
                },
                {
                  label: 'Toggle &Developer Tools',
                  accelerator: 'Alt+Ctrl+I',
                  click: () => {
                    this.app.mainWindow.webContents.toggleDevTools();
                  }
                }
              ]
            : [
                {
                  label: 'Toggle &Full Screen',
                  accelerator: 'F11',
                  click: () => {
                    this.app.mainWindow.setFullScreen(
                      !this.app.mainWindow.isFullScreen()
                    );
                  }
                }
              ]
      },
      {
        label: 'Help',
        submenu: [
          {
            label: 'Learn More',
            click() {
              shell.openExternal('https://electronjs.org');
            }
          },
          {
            label: 'Documentation',
            click() {
              shell.openExternal(
                'https://github.com/electron/electron/tree/master/docs#readme'
              );
            }
          },
          {
            label: 'Community Discussions',
            click() {
              shell.openExternal('https://www.electronjs.org/community');
            }
          },
          {
            label: 'Search Issues',
            click() {
              shell.openExternal('https://github.com/electron/electron/issues');
            }
          }
        ]
      }
    ];

    return templateDefault;
  }
}
