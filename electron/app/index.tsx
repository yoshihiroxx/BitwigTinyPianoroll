import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { ipcRenderer, remote } from 'electron';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
import { loadMidiFile } from './actions/debug';
import Model from './models/ModelCreator';
import Project from './models/Project';
import { onLoadMidiFile, onCreateNewMidiFile } from './actions/menuEvents';
import { onChangeTheme, onChangePreferences } from './actions/preferences';
// import initMainMenu from './menu/MainMenu';
import MidiWriter from './midi/MidiWriter';
import MidiClip from './models/MidiClip';

const store = configureStore();

// initMainMenu(store);

const menu = new remote.Menu();
menu.append(
  new remote.MenuItem({
    label: 'Open Debug Clip',
    click() {
      store.dispatch(loadMidiFile('maschine-pattern2.mid'));
    }
  })
);
menu.append(new remote.MenuItem({ type: 'separator' }));
menu.append(
  new remote.MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true })
);

window.addEventListener(
  'contextmenu',
  e => {
    e.preventDefault();
    menu.popup({ window: remote.getCurrentWindow() });
  },
  false
);

ipcRenderer.send('test');
ipcRenderer.on('test', (event, arg) => {
  console.log('ipc connection test : ');
  console.log(arg);
});

ipcRenderer.on('update-preferences', (event, arg) => {
  // @todo update preferences
});

ipcRenderer.on('update-theme', (event, arg) => {
  store.dispatch(onChangeTheme(arg));
});

ipcRenderer.on('load-midifile', (event, parsedMidi) => {
  store.dispatch(onLoadMidiFile(parsedMidi));
});

ipcRenderer.on('new-midifile', event => {
  store.dispatch(onCreateNewMidiFile());
});

ipcRenderer.on('export-clip', (event, filePath) => {
  const state = store.getState();
  const writer = new MidiWriter();
  // @todo referctoring
  const ml = state.editor.tool.notes;
  const midiClip = new MidiClip().set('midiList', ml);
  const buffer = writer.buildFromClip(midiClip);
  const fs = remote.require('fs');
  console.log(fs);
  fs.writeFileSync(filePath, Buffer.from(buffer));
});

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () => {
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );
});
