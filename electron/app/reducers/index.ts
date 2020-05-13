import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import counter from './counter';
import preferences from './preferences';
import project from './project';
import editor from './editor';

export default function createRootReducer(history: History) {
  // @todo combineReducers
  return combineReducers({
    router: connectRouter(history),
    counter,
    project,
    preferences,
    editor
  });
}
