import { remote, ipcRenderer } from 'electron';
import Theme from '../models/Theme';
import Preferences from '../models/Preferences';
import { GetState, Dispatch, IPCArgments } from '../reducers/types';
import GeneralPref from '../models/GeneralPref';

export const SET_PREFERENCES = 'SET_PREFERENCES';
export const SET_THEME = 'SET_THEME';

export const readfile = (_path: string) => {
  return new Promise((resolve, reject) => {
    remote.require('fs').readFile(_path, 'utf-8', (err, data) => {
      return err ? reject(err) : resolve(data);
    });
  });
};

export const writePreferences = (pref: Preferences) => {
  const path = remote.require('path');
  const process = remote.require('process');
  const appPath = remote.app.getAppPath();
  const dirname = process.env.NODE_ENV ? appPath : process.resourcesPath;

  const p = path.resolve(dirname, 'extraResources', 'settings', 'files.json');
  readfile(p)
    .then(data => {
      const paths = JSON.parse(data);
      const settingFilePath = path.resolve(
        appPath,
        `./settings/$
        {paths.files.settings}`
      );
      remote
        .require('fs')
        .writeFileSync(settingFilePath, JSON.stringify(pref.toJSON(), null, 2));
      return true;
    })
    .catch(function(error) {
      return false;
    });
};

export function updatePreferences(pref: Preferences) {
  return {
    type: SET_PREFERENCES,
    payload: {
      preferences: pref
    },
    meta: {},
    error: null
  };
}

export function onChangePreferences(obj: any) {
  return (dispatch: Dispatch, getState: GetState) => {
    if (!obj) {
      throw new Error('must give the Preferences as a plane js object');
    }
    let resolved = false;
    setTimeout(() => {
      if (!resolved) throw new Error('OSC server does not respond.');
    }, 5000);

    ipcRenderer.once(
      '/v1/tinypianoroll/preferences',
      (e, args: IPCArgments) => {
        resolved = true;
        const nextPreferences = new Preferences(obj);
        writePreferences(nextPreferences);
      }
    );
    ipcRenderer.send('/v1/tinypianoroll/preferences', {
      type: 'set',
      payload: obj.toJS(),
      error: false
    });
  };
}

export function reloadPreferences() {
  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState();
    onChangePreferences(state.preferences);
  };
}

export function onChangeGeneralPref(obj: any) {
  return (dispatch: Dispatch, getState: GetState) => {
    const { preferences } = getState();
    if (!obj) {
      throw new Error('must give the Preferences as a plane js object');
    }
    const nextGeneralPref = new GeneralPref(obj);
    const nextPreferences = preferences.set('general', nextGeneralPref);
    writePreferences(nextPreferences);
    dispatch(updatePreferences(nextPreferences));
  };
}

export function onChangeTheme(obj: any) {
  return (dispatch: Dispatch, getState: GetState) => {
    const { preferences } = getState();
    if (!obj) {
      throw new Error('must give the Theme as a plane js object');
    }
    const nextTheme = new Theme(obj);
    const nextPreferences = preferences.set('theme', nextTheme);
    writePreferences(nextPreferences);
    dispatch(updatePreferences(nextPreferences));
  };
}
