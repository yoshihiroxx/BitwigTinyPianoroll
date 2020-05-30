import { Action } from 'redux';
import { combineReducers } from 'redux-immutable';
import Editor from '../models/Editor';
import project from './project';
import tool from './tool';
import PenTool from '../tool/PenTool';
import {
  HANDLE_EVENT,
  ADD_NOTE,
  REMOVE_NOTE,
  CLEAR_SELECTIONS,
  handleEvent,
  handleTool
} from '../actions/tool';
import { LOAD_MIDIFILE, loadMidiFile } from '../actions/debug';
import MidiClip from '../models/MidiClip';
import MidiList, { createMidiListByMidiFile } from '../models/MidiList';
import { ParsedMidi } from '../models/ParsedMidi';

type Actions =
  | ReturnType<typeof handleEvent>
  | ReturnType<typeof handleTool>
  | { type: string; payload: { parsedMidi: ParsedMidi } };

function editReducer(state: Editor, action: Actions) {
  switch (action.type) {
    case LOAD_MIDIFILE: {
      const p = state.project;
      let nextProject = p.setIn(['tracks', 0, 0], new MidiClip());
      nextProject = nextProject.setIn(
        ['tracks', 0, 0, 'midiList'],
        createMidiListByMidiFile(action.payload.parsedMidi)
      );
      const nextTool = state.tool.set(
        'notes',
        nextProject.getIn(['tracks', 0, 0, 'midiList'])
      );
      return new Editor({ project: nextProject, tool: nextTool });
    }

    case ADD_NOTE: {
      let nextNotes = state.getIn(['tool', 'notes', 'notes']);
      nextNotes = nextNotes.push(action.payload.note);
      return state.setIn(['tool', 'notes', 'notes'], nextNotes);
    }

    case REMOVE_NOTE: {
      let nextNotes = state.getIn(['tool', 'notes', 'notes']);
      nextNotes = nextNotes.filterNot((note: MidiNote) => {
        return note.equals(action.payload.note);
      });
      return state.setIn(['tool', 'notes', 'notes'], nextNotes);
    }

    case CLEAR_SELECTIONS: {
      return state.setIn(['tool', 'selections'], new MidiList());
    }

    default:
      return state;
  }
}

function editor(state = new Editor(), action: Actions) {
  const combinedReducer = combineReducers({ project, tool });
  const intermediateState = combinedReducer(state, action);
  const finalState = editReducer(intermediateState, action);
  return finalState;
}

export default editor;
