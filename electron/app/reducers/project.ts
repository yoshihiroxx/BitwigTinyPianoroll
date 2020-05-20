import { Action } from 'redux';
import MidiParser from 'midi-parser-js';
import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/counter';
import Project, { ProjectRecordType } from '../models/Project';
import { LOAD_MIDIFILE } from '../actions/debug';
import MidiClip from '../models/MidiClip';
import { createMidiListByMidiFile } from '../models/MidiList';

export default function project(state = new Project(), action: Action<string>) {
  switch (action.type) {
    case LOAD_MIDIFILE: {
      let nextState = state.setIn(['tracks', 0, 0], new MidiClip());
      nextState = nextState.setIn(
        ['tracks', 0, 0, 'midiList'],
        createMidiListByMidiFile(action.payload.parsedMidi)
      );
      console.log(JSON.stringify(nextState, null, 2));
      console.log(action.payload);
      return nextState;
    }
    case DECREMENT_COUNTER:
      return state;
    default:
      return state;
  }
}
