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
// import initMainMenu from './menu/MainMenu';

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

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () => {
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  );
});
