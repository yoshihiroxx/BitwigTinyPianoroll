import { remote } from 'electron';
import Theme from '../models/Theme';
import Preferences from '../models/Preferences';
import { GetState, Dispatch } from '../reducers/types';

export const SET_PREFERENCES = 'SET_PREFERENCES';
export const SET_THEME = 'SET_THEME';

const readfile = (_path: string) => {
  return new Promise((resolve, reject) => {
    remote.require('fs').readFile(_path, 'utf-8', (err, data) => {
      return err ? reject(err) : resolve(data);
    });
  });
};

export const writePreferences = (pref: Preferences) => {
  const path = remote.require('path');
  const appPath = remote.app.getAppPath();
  const p = path.resolve(appPath, './settings/files.json');
  readfile(p)
    .then(data => {
      const paths = JSON.parse(data);
      const settingFilePath = path.resolve(
        appPath,
        `./settings/${paths.files.settings}`
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
    const nextPreferences = new Preferences(obj);
    const { preferences } = getState();
    writePreferences(preferences);
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
