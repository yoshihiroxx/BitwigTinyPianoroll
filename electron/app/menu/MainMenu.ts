import { remote } from 'electron';
import { loadMidiFile } from '../actions/debug';

const isMac = process.platform === 'darwin';

function initMainMenu(store) {
  const template = [
    // { role: 'appMenu' }
    ...(isMac
      ? [
          {
            label: 'BitwigTinyPianoroll',
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideothers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' }
            ]
          }
        ]
      : []),
    // { role: 'fileMenu' }
    {
      label: 'File',
      submenu: [
        {
          label: 'open MidiFile',
          click() {
            remote.dialog
              .showOpenDialog({
                properties: ['openFile', 'multiSelections'],
                filters: [
                  { name: 'Midi Files', extensions: ['mid'] },
                  { name: 'All Files', extensions: ['*'] }
                ]
              })
              .then(result => {
                store.dispatch(loadMidiFile(result.filePaths[0]));
                return result.filePaths;
              })
              .catch(err => {
                console.log(err);
              });
          }
        },
        ...(isMac ? [{ role: 'close' }] : [{ role: 'quit' }])
      ]
    },
    // { role: 'editMenu' }
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(isMac
          ? [
              { role: 'pasteAndMatchStyle' },
              { role: 'delete' },
              { role: 'selectAll' },
              { type: 'separator' },
              {
                label: 'Speech',
                submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }]
              }
            ]
          : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }])
      ]
    },
    // { role: 'viewMenu' }
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    // { role: 'windowMenu' }
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(isMac
          ? [
              { type: 'separator' },
              { role: 'front' },
              { type: 'separator' },
              { role: 'window' }
            ]
          : [{ role: 'close' }])
      ]
    }
  ];

  const mainMenu = remote.Menu.buildFromTemplate(template);
  remote.Menu.setApplicationMenu(mainMenu);
}

export default initMainMenu;
