import { Action } from 'redux';
import MidiParser from 'midi-parser-js';
import { INCREMENT_COUNTER, DECREMENT_COUNTER } from '../actions/counter';
import Project, { ProjectRecordType } from '../models/Project';
import MidiClip from '../models/MidiClip';
import { createMidiListByMidiFile } from '../models/MidiList';

export default function project(state = new Project(), action: Action<string>) {
  switch (action.type) {
    case DECREMENT_COUNTER:
      return state;
    default:
      return state;
  }
}
