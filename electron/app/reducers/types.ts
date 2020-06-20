import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';
import { BrowserWindow } from 'electron';
import { PreferencesRecordType } from '../models/Preferences';
import { EditorRecordType } from '../models/Editor';

export type counterStateType = {
  counter: number;
};

export type ModelType = {
  preferences: PreferencesRecordType;
  editor: EditorRecordType;
};

export type GetState = () => ModelType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<ModelType, Action<string>>;

export type ActionType = {
  type: string;
  payload: any;
  meta: any;
  error: boolean;
};

export type AppWindowsType = {
  [index: string]: BrowserWindow;
};
