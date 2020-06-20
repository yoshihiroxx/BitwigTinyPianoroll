import { combineReducers, Action } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import counter from './counter';
import preferences from './preferences';
import editor from './editor';
import project from './project';

export default function createRootReducer(history: History) {
  // @todo combineReducers
  return combineReducers({
    router: connectRouter(history),
    counter,
    preferences,
    editor
  });
}
