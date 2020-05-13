import { Action } from 'redux';
import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/counter';
import Preferences from '../models/Preferences';

export default function counter(state = Preferences, action: Action<string>) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return state;
    case DECREMENT_COUNTER:
      return state;
    default:
      return state;
  }
}
