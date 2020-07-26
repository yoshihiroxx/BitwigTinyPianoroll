import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { ipcRenderer, remote } from 'electron';
import * as osc from 'osc';
import { IPCArgments } from './reducers/types';
import { configureStore, history } from './store/configureStore';
import './app.global.css';
import { loadMidiFile } from './actions/debug';
import { onLoadMidiFile, onCreateNewMidiFile } from './actions/menuEvents';
import {
  onChangeTheme,
  onChangePreferences,
  onChangeGeneralPref,
  updatePreferences
} from './actions/preferences';
import Preferences from './models/Preferences';
import MidiWriter from './midi/MidiWriter';
import MidiClip from './models/MidiClip';
import MidiNote from './models/MidiNote';
import { addNote, removeNote } from './actions/tool';

const store = configureStore();

// setup the menu

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

ipcRenderer.on('/v1/tinypianoroll/preferences', (e, args: IPCArgments) => {
  if (args.error) throw new Error('failed to open OSC port.');
  const nextPreferences = new Preferences(args.payload);
  store.dispatch(updatePreferences(nextPreferences));
});

// setup ipc
ipcRenderer.on('/v1/tinypianoroll/oscclip/notes', (event, args) => {
  const n = new MidiNote(args.payload);
  if (args.meta.actionType === 'SET_NOTE') {
    store.dispatch(addNote(n));
  } else if (args.meta.actionType === 'CLEAR_NOTE') {
    store.dispatch(removeNote(n));
  }
  // @todo dispatch add note
});

ipcRenderer.on('update-theme', (event, arg) => {
  store.dispatch(onChangeTheme(arg));
});

ipcRenderer.on('update-general-preferences', (event, arg) => {
  store.dispatch(onChangeGeneralPref(arg));
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
  fs.writeFileSync(filePath, Buffer.from(buffer));
});

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line global-require
  const Root = require('./containers/Root').default;
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );
});
