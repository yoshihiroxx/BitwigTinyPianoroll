import { Action } from 'redux';
import { ActionType } from './types';
import PenTool from '../tool/PenTool';
import EraserTool from '../tool/EraserTool';
import {
  HANDLE_MOUSE_EVENT,
  HANDLE_TOOL,
  handleMouseEvent,
  handleTool,
  focusClip
} from '../actions/tool';
import MidiNote from '../models/MidiNote';
import MidiList from '../models/MidiList';

type Actions =
  | ReturnType<typeof handleMouseEvent>
  | ReturnType<typeof handleTool>;

export default function tool(state = new PenTool(), action: Actions) {
  switch (action.type) {
    case HANDLE_MOUSE_EVENT: {
      switch (action.meta.event) {
        case 'click': {
          if (typeof action.payload.beatOrNote === 'number') {
            return state.onClick(
              action.payload.beatOrNote,
              action.payload.noteNumber
            );
          }
          if (action.payload.beatOrNote instanceof MidiNote) {
            return state.onClick(action.payload.beatOrNote);
          }
          return state;
        }
        case 'drag':
          return state.onDrag(
            action.payload.beatOrNote,
            action.payload.noteNumber
          );
        case 'release': {
          // console.log(JSON.stringify(state, null, 2));
          const nextState = state.onRelease(
            action.payload.beatOrNote,
            action.payload.noteNumber
          );
          return nextState;
        }
        default:
          return state;
      }
    }
    case HANDLE_TOOL: {
      // let nextState = state;
      // if (action.meta.force) {
      //   nextState = nextState.set('isDrawing', false);
      //   nextState = nextState.set('drawing', new MidiList());
      // }

      if (state.get('isDrawing')) return state;
      switch (action.meta.toolType) {
        case 'pen': {
          const penTool = new PenTool(state.prepareToChange());
          return penTool;
        }
        case 'eraser': {
          const eraserTool = new EraserTool(state.prepareToChange());
          return eraserTool;
        }
        default:
          return nextState;
      }
    }
    default:
      return state;
  }
}
