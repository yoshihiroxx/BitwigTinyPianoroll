import { Action } from 'redux';
import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/counter';
import Project, { ProjectRecordType } from '../models/Project';
import { LOAD_MIDIFILE } from '../actions/debug';

export default function project(state = Project, action: Action<string>) {
  switch (action.type) {
    case LOAD_MIDIFILE:
      console.log(state.get('tracks'));
      return state;
    case DECREMENT_COUNTER:
      return state;
    default:
      return state;
  }
}
