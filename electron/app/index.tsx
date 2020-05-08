import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { AppContainer as ReactHotAppContainer } from 'react-hot-loader';
import { ipcRenderer } from 'electron';
import Root from './containers/Root';
import { configureStore, history } from './store/configureStore';
import './app.global.css';

const store = configureStore();

ipcRenderer.send('test');
ipcRenderer.on('test', (event, arg) => {
  console.log('arg : ');
  console.log(arg);
});

const AppContainer = process.env.PLAIN_HMR ? Fragment : ReactHotAppContainer;

document.addEventListener('DOMContentLoaded', () =>
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.getElementById('root')
  )
);
