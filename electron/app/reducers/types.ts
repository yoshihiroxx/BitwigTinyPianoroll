import { Dispatch as ReduxDispatch, Store as ReduxStore, Action } from 'redux';
import { BrowserWindow } from 'electron';

export type counterStateType = {
  counter: number;
};

export type GetState = () => counterStateType;

export type Dispatch = ReduxDispatch<Action<string>>;

export type Store = ReduxStore<counterStateType, Action<string>>;

export type ActionType = {
  type: string;
  payload: any;
  meta: any;
  error: boolean;
};

export type AppWindowsType = {
  [index: string]: BrowserWindow;
};
