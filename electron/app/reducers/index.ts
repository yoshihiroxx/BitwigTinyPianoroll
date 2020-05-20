import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import counter from './counter';
import preferences from './preferences';
import project from './project';
import tool from './tool';

export default function createRootReducer(history: History) {
  // @todo combineReducers
  return combineReducers({
    router: connectRouter(history),
    counter,
    project,
    preferences,
    tool
  });
}
