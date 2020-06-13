import { Action } from 'redux';
import { remote } from 'electron';
import path from 'path';
import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/counter';
import { SET_PREFERENCES, SET_THEME } from '../actions/preferences';
import Preferences from '../models/Preferences';
import KeyBinds from '../models/KeyBinds';
import Theme from '../models/Theme';

export default function counter(
  state = createPreferences(),
  action: Action<string>
) {
  switch (action.type) {
    case SET_THEME: {
      return state.set('theme', action.payload.theme);
    }
    case SET_PREFERENCES:
      return action.payload.preferences;
    default:
      return state;
  }
}

export const createPreferences = () => {
  const filePath = path.resolve(__dirname, './settings/defaultSettings.json');
  const json = remote.require('fs').readFileSync(filePath, 'utf-8');
  if (!json) {
    throw new Error("setting file didn't be find.");
  }
  const obj = JSON.parse(json);
  const keyBinds = new KeyBinds(obj.keyBinds);
  const theme = new Theme(obj.theme);
  obj.keyBinds = keyBinds;
  obj.theme = theme;
  return new Preferences(obj);
};
